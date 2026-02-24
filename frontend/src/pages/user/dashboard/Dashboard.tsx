import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../../components/layouts/Navbar";
import { C } from "../../../components/ui/palette";
import { IconUpload, IconImage } from "../../../components/ui/icons";
import { imageService, type ImageItem, type UploadPayload } from "../../../services/api/image.api";

import { StatsBar }     from "../../../components/dashboard/StatsBar";
import { SkeletonCard } from "../../../components/dashboard/SkeletonCard";
import { ImageCard }    from "../../../components/dashboard/ImageCard";
import { EditModal }    from "../../../components/dashboard/EditModal";
import { DeleteModal }  from "../../../components/dashboard/DeleteModal";
import { UploadModal }  from "../../../components/dashboard/UploadModal";

/* UploadFile is only needed for the handleUpload callback signature */
interface UploadFile { id: string; file: File; preview: string; title: string; error: string; }

export default function DashboardPage() {
  const [images, setImages]         = useState<ImageItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [editItem, setEditItem]     = useState<ImageItem | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ImageItem | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "public" | "private">("all");
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [draggedId, setDraggedId]   = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const reorderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    imageService.getImages()
      .then(res => setImages(res.images))
      .catch(err => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const togglePrivacy = async (id: string) => {
    setToggleLoadingId(id);
    try {
      const res = await imageService.toggleVisibility(id);
      setImages(prev => prev.map(img => img._id === id ? res.image : img));
      showToast("Privacy updated");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleEdit = async (id: string, title: string, file?: File) => {
    setEditSaving(true);
    try {
      const res = await imageService.updateImage(id, title, file);
      setImages(prev => prev.map(img => img._id === id ? res.image : img));
      setEditItem(null);
      showToast(file ? "Image and title updated" : "Image title updated");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await imageService.deleteImage(deleteItem._id);
      setImages(prev => prev.filter(img => img._id !== deleteItem._id));
      setDeleteItem(null);
      showToast("Image deleted", "error");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpload = async (files: UploadFile[]) => {
    setUploading(true);
    try {
      const payload: UploadPayload[] = files.map(f => ({ file: f.file, title: f.title }));
      const res = await imageService.uploadImages(payload);
      setImages(prev => [...res.images, ...prev]);
      setUploadOpen(false);
      showToast(`${res.images.length} image${res.images.length > 1 ? "s" : ""} uploaded!`);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => setDraggedId(id), 0);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  }, [draggedId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === targetId) { setDraggedId(null); return; }
    setImages(prev => {
      const next = [...prev];
      const from = next.findIndex(img => img._id === draggedId);
      const to   = next.findIndex(img => img._id === targetId);
      if (from === -1 || to === -1) return prev;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      if (reorderTimer.current) clearTimeout(reorderTimer.current);
      reorderTimer.current = setTimeout(async () => {
        try { await imageService.reorderImages(next.map((img, idx) => ({ id: img._id, order: idx }))); }
        catch { }
      }, 600);
      return next;
    });
    setDraggedId(null);
  }, [draggedId]);

  const handleDragEnd = useCallback(() => { setDraggedId(null); setDragOverId(null); }, []);

  const filtered =
    filterMode === "all"     ? images :
    filterMode === "public"  ? images.filter(i => i.visibility === "public") :
    images.filter(i => i.visibility === "private");

  const SKELETON_HEIGHTS = [220, 280, 190, 250, 200, 260];

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #C084FC44; border-radius: 99px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-pulse { animation: shimmer 1.8s ease-in-out infinite; background-size: 200% 100%; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-[0.08]"
          style={{ background: "radial-gradient(circle,#C084FC,transparent)" }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="display font-bold text-2xl sm:text-3xl mb-1" style={{ color: C.text }}>My Gallery</h1>
              <p className="text-sm" style={{ color: C.muted }}>Drag cards to rearrange · Hover to edit or delete</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 4px 14px rgba(124,92,252,0.30)" }}
            >
              <IconUpload /> <span>Upload Images</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
          <StatsBar images={images} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}
          className="flex items-center gap-2 mb-6">
          {(["all", "public", "private"] as const).map(mode => (
            <button key={mode} onClick={() => setFilterMode(mode)}
              className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
              style={{
                background: filterMode === mode ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "rgba(255,255,255,0.8)",
                color: filterMode === mode ? "#fff" : C.muted,
                border: `1px solid ${filterMode === mode ? "transparent" : C.border}`,
                boxShadow: filterMode === mode ? "0 4px 14px rgba(124,92,252,0.28)" : "none",
              }}>
              {mode} {mode === "all" ? `(${images.length})` : mode === "public" ? `(${images.filter(i=>i.visibility==="public").length})` : `(${images.filter(i=>i.visibility==="private").length})`}
            </button>
          ))}
          <div className="ml-auto text-xs font-medium" style={{ color: C.muted }}>
            {filtered.length} image{filtered.length !== 1 ? "s" : ""}
          </div>
        </motion.div>

        {loading && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {SKELETON_HEIGHTS.map((h, i) => (
              <div key={i} className="break-inside-avoid mb-4"><SkeletonCard height={h} /></div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.6)", border: `2px dashed ${C.border}` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,92,252,0.08)", color: C.muted }}>
              <IconImage />
            </div>
            <p className="font-semibold mb-1" style={{ color: C.text }}>
              {filterMode === "all" ? "No images yet" : `No ${filterMode} images`}
            </p>
            <p className="text-sm mb-5" style={{ color: C.muted }}>
              {filterMode === "all" ? "Upload your first image to get started" : `Switch to "All" to see your images`}
            </p>
            {filterMode === "all" && (
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 4px 14px rgba(124,92,252,0.28)" }}>
                <IconUpload /> Upload Images
              </motion.button>
            )}
          </motion.div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: "1rem", alignItems: "start" }}>
            <AnimatePresence>
              {filtered.map(img => (
                <ImageCard
                  key={img._id}
                  item={img}
                  toggleLoading={toggleLoadingId === img._id}
                  isDragging={draggedId === img._id}
                  isDragOver={dragOverId === img._id}
                  onDragStart={e => handleDragStart(e, img._id)}
                  onDragEnter={e => handleDragEnter(e, img._id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, img._id)}
                  onDragEnd={handleDragEnd}
                  onEdit={setEditItem}
                  onDelete={setDeleteItem}
                  onTogglePrivacy={togglePrivacy}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {editItem && <EditModal item={editItem} saving={editSaving} onSave={handleEdit} onClose={() => !editSaving && setEditItem(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {deleteItem && <DeleteModal item={deleteItem} deleting={deleting} onConfirm={handleDelete} onClose={() => !deleting && setDeleteItem(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {uploadOpen && <UploadModal uploading={uploading} onClose={() => !uploading && setUploadOpen(false)} onUpload={handleUpload} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl"
            style={{
              background: toast.type === "success" ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "linear-gradient(135deg,#FF6B6B,#FF4444)",
              boxShadow: toast.type === "success" ? "0 12px 36px rgba(124,92,252,0.35)" : "0 12px 36px rgba(255,107,107,0.35)",
            }}>
            <span>{toast.type === "success" ? "✦" : "✕"}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}