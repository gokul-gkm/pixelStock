import { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder, useDragControls, type Variants } from "framer-motion";
import Navbar from "../../../components/layouts/Navbar";
import { C } from "../../../components/ui/palette";

/* ─── TYPES ───────────────────────────────────────────────── */
interface ImageItem {
  id: string;
  title: string;
  bg: string;
  height: number;
  isPublic: boolean;
  uploadedAt: string;
  size: string;
}

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  error: string;
}

/* ─── SAMPLE DATA ─────────────────────────────────────────── */
const SAMPLE: ImageItem[] = [
  { id:"1", title:"Mountain Mist",  bg:"linear-gradient(135deg,#667EEA,#764BA2)", height:220, isPublic:true,  uploadedAt:"2 hours ago",   size:"2.4 MB" },
  { id:"2", title:"Bloom Abstract", bg:"linear-gradient(135deg,#F093FB,#F5576C)", height:280, isPublic:true,  uploadedAt:"Yesterday",     size:"1.8 MB" },
  { id:"3", title:"Ocean Light",    bg:"linear-gradient(135deg,#4FACFE,#00F2FE)", height:190, isPublic:false, uploadedAt:"2 days ago",    size:"3.1 MB" },
  { id:"4", title:"Forest Walk",    bg:"linear-gradient(135deg,#43E97B,#38F9D7)", height:250, isPublic:true,  uploadedAt:"3 days ago",    size:"2.7 MB" },
  { id:"5", title:"Sunset Haze",    bg:"linear-gradient(135deg,#FA709A,#FEE140)", height:200, isPublic:false, uploadedAt:"4 days ago",    size:"1.5 MB" },
  { id:"6", title:"Lavender Dream", bg:"linear-gradient(135deg,#A18CD1,#FBC2EB)", height:260, isPublic:true,  uploadedAt:"5 days ago",    size:"2.2 MB" },
  { id:"7", title:"Pastel Sky",     bg:"linear-gradient(135deg,#FBC2EB,#A6C1EE)", height:210, isPublic:true,  uploadedAt:"1 week ago",    size:"1.9 MB" },
  { id:"8", title:"Urban Glow",     bg:"linear-gradient(135deg,#FD746C,#FF9068)", height:240, isPublic:false, uploadedAt:"1 week ago",    size:"3.4 MB" },
  { id:"9", title:"Cloud Nine",     bg:"linear-gradient(135deg,#C2E9FB,#A1C4FD)", height:180, isPublic:true,  uploadedAt:"2 weeks ago",   size:"1.1 MB" },
];

/* ─── ICON COMPONENTS ─────────────────────────────────────── */
const IconEdit = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const IconUpload = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconDrag = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/>
    <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
    <circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
  </svg>
);
const IconClose = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IconLock = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const IconImage = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

/* ─── PRIVACY TOGGLE ──────────────────────────────────────── */
function PrivacyToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
      style={{
        background: value ? "rgba(34,197,94,0.15)" : "rgba(124,92,252,0.12)",
        color: value ? "#15803D" : C.accent1,
        border: `1px solid ${value ? "rgba(34,197,94,0.25)" : "rgba(124,92,252,0.2)"}`,
      }}
    >
      {value ? <IconGlobe /> : <IconLock />}
      {value ? "Public" : "Private"}
    </button>
  );
}

/* ─── EDIT MODAL ──────────────────────────────────────────── */
function EditModal({ item, onSave, onClose }: { item: ImageItem; onSave: (id: string, title: string) => void; onClose: () => void }) {
  const [title, setTitle] = useState(item.title);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-6"
        style={{ background: C.surface, backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, boxShadow: "0 24px 64px rgba(124,92,252,0.18)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="display font-bold text-lg" style={{ color: C.text }}>Edit Image</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "rgba(124,92,252,0.06)", color: C.muted }}>
            <IconClose />
          </button>
        </div>
        {/* Preview */}
        <div className="w-full h-28 rounded-2xl mb-5" style={{ background: item.bg }} />
        <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Title</label>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all mb-5"
          style={{ background: "#F8F7FF", border: `1.5px solid ${title ? C.accent1 : C.border}`, color: C.text }}
          placeholder="Enter image title..."
        />
        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ color: C.muted, borderColor: C.border }}>Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { if (title.trim()) { onSave(item.id, title.trim()); onClose(); } }}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: title.trim() ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "#E5E7EB",
              color: title.trim() ? "#fff" : C.muted,
              boxShadow: title.trim() ? "0 6px 18px rgba(124,92,252,0.28)" : "none",
            }}>
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── DELETE CONFIRM MODAL ────────────────────────────────── */
function DeleteModal({ item, onConfirm, onClose }: { item: ImageItem; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }} transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-6"
        style={{ background: C.surface, backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, boxShadow: "0 24px 64px rgba(255,107,107,0.18)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,107,107,0.12)" }}>
          <IconTrash />
        </div>
        <h3 className="display font-bold text-lg text-center mb-1.5" style={{ color: C.text }}>Delete Image?</h3>
        <p className="text-sm text-center mb-5" style={{ color: C.muted }}>
          "<span className="font-semibold" style={{ color: C.text }}>{item.title}</span>" will be permanently removed.
        </p>
        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ color: C.muted, borderColor: C.border }}>Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#FF6B6B,#FF4444)", boxShadow: "0 6px 18px rgba(255,107,107,0.3)" }}>
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── UPLOAD MODAL ────────────────────────────────────────── */
function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (files: UploadFile[]) => void }) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadFile[] = Array.from(incoming).map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      title: f.name.replace(/\.[^.]+$/, ""),
      error: "",
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));
  const updateTitle = (id: string, title: string) =>
    setFiles(prev => prev.map(f => f.id === id ? { ...f, title, error: title.trim() ? "" : "Title is required" } : f));

  const canSave = files.length > 0 && files.every(f => f.title.trim());

  const handleSave = () => {
    const validated = files.map(f => ({ ...f, error: f.title.trim() ? "" : "Title is required" }));
    if (validated.some(f => f.error)) { setFiles(validated); return; }
    onUpload(files);
    onClose();
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.18 } },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full sm:max-w-lg flex flex-col"
        style={{
          background: C.surface, backdropFilter: "blur(20px)",
          border: `1px solid ${C.border}`,
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -16px 60px rgba(124,92,252,0.16)",
          maxHeight: "92vh",
        }}
        // On sm screens, full rounded
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <h3 className="display font-bold text-lg" style={{ color: C.text }}>Upload Images</h3>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Add a title to each image before saving</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,92,252,0.06)", color: C.muted }}>
            <IconClose />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pt-5 flex-shrink-0">
          <motion.div
            onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
            onDragLeave={() => setDraggingOver(false)}
            onDrop={e => { e.preventDefault(); setDraggingOver(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            animate={{ scale: draggingOver ? 1.02 : 1 }}
            className="w-full rounded-2xl border-2 border-dashed py-7 flex flex-col items-center gap-2 cursor-pointer transition-colors"
            style={{
              borderColor: draggingOver ? C.accent1 : "rgba(124,92,252,0.25)",
              background: draggingOver ? "rgba(124,92,252,0.06)" : "rgba(124,92,252,0.03)",
            }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)" }}>
              <IconUpload />
            </div>
            <p className="text-sm font-semibold" style={{ color: C.text }}>Drop images or click to browse</p>
            <p className="text-xs" style={{ color: C.muted }}>PNG, JPG, GIF up to 10MB each</p>
            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => addFiles(e.target.files)} />
          </motion.div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="px-6 pt-4 pb-2 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>
                {files.length} image{files.length > 1 ? "s" : ""} selected
              </p>
              <button onClick={() => setFiles([])} className="text-xs font-medium" style={{ color: C.coral }}>
                Clear all
              </button>
            </div>
            <AnimatePresence initial={false}>
              {files.map(f => (
                <motion.div key={f.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                  className="flex items-start gap-3 mb-3 p-3 rounded-2xl"
                  style={{ background: "#F8F7FF", border: `1px solid ${f.error ? "rgba(255,107,107,0.3)" : C.border}` }}>
                  {/* Preview */}
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-purple-100">
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Title input */}
                  <div className="flex-1 min-w-0">
                    <input
                      value={f.title}
                      onChange={e => updateTitle(f.id, e.target.value)}
                      placeholder="Add a title (required)..."
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{
                        background: "#fff",
                        border: `1.5px solid ${f.error ? C.coral : f.title.trim() ? C.accent1 : C.border}`,
                        color: C.text,
                      }}
                    />
                    {f.error && <p className="text-[10px] mt-1 font-medium" style={{ color: C.coral }}>{f.error}</p>}
                    <p className="text-[10px] mt-1" style={{ color: C.muted }}>
                      {(f.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  {/* Remove */}
                  <button onClick={() => removeFile(f.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(255,107,107,0.1)", color: C.coral }}>
                    <IconClose />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3 flex-shrink-0"
          style={{ borderTop: files.length > 0 ? `1px solid ${C.border}` : "none" }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-semibold border"
            style={{ color: C.muted, borderColor: C.border }}>Cancel</button>
          <motion.button
            whileHover={canSave ? { scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" } : {}}
            whileTap={canSave ? { scale: 0.97 } : {}}
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: canSave ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "#E5E7EB",
              color: canSave ? "#fff" : C.muted,
              boxShadow: canSave ? "0 6px 18px rgba(124,92,252,0.28)" : "none",
            }}>
            Save {files.length > 0 ? `${files.length} Image${files.length > 1 ? "s" : ""}` : "Images"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── IMAGE CARD ──────────────────────────────────────────── */
function ImageCard({
  item, onEdit, onDelete, onTogglePrivacy,
}: {
  item: ImageItem;
  onEdit: (item: ImageItem) => void;
  onDelete: (item: ImageItem) => void;
  onTogglePrivacy: (id: string) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="relative group"
      style={{ listStyle: "none" }}
    >
      <motion.div
        layout
        whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(124,92,252,0.16)" }}
        transition={{ duration: 0.25 }}
        className="relative rounded-3xl overflow-hidden cursor-default select-none"
        style={{ background: item.bg, height: item.height, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
      >
        {/* Drag handle */}
        <motion.div
          onPointerDown={e => dragControls.start(e)}
          className="absolute top-3 left-3 z-20 w-7 h-7 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", color: "#fff" }}
          whileHover={{ scale: 1.1 }}
        >
          <IconDrag />
        </motion.div>

        {/* Privacy badge */}
        <div className="absolute top-3 right-3 z-20">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${item.isPublic ? "bg-green-500/80 text-white" : "bg-black/50 text-white"}`}>
            {item.isPublic ? <IconGlobe /> : <IconLock />}
            {item.isPublic ? "Public" : "Private"}
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bottom info + controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-semibold text-sm mb-2 truncate">{item.title}</p>
          <div className="flex items-center justify-between gap-2">
            {/* Privacy toggle */}
            <PrivacyToggle value={item.isPublic} onChange={() => onTogglePrivacy(item.id)} />
            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className="w-7 h-7 rounded-xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.20)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
                <IconEdit />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                className="w-7 h-7 rounded-xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: "rgba(255,107,107,0.35)", color: "#fff", border: "1px solid rgba(255,107,107,0.4)" }}>
                <IconTrash />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

/* ─── STATS BAR ───────────────────────────────────────────── */
function StatsBar({ images }: { images: ImageItem[] }) {
  const total = images.length;
  const pub = images.filter(i => i.isPublic).length;
  const priv = total - pub;
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: "Total Images", value: total, color: C.accent1, bg: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.15)" },
        { label: "Public",       value: pub,   color: "#15803D", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.15)"  },
        { label: "Private",      value: priv,  color: "#DC2626", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.15)" },
      ].map(s => (
        <div key={s.label} className="rounded-2xl px-4 py-3 text-center"
          style={{ background: s.bg, border: `1px solid ${s.border}` }}>
          <div className="display font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
          <div className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── DASHBOARD ───────────────────────────────────────────── */
export default function DashboardPage() {
  const [images, setImages] = useState<ImageItem[]>(SAMPLE);
  const [editItem, setEditItem] = useState<ImageItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ImageItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "public" | "private">("all");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const togglePrivacy = (id: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, isPublic: !img.isPublic } : img));
    showToast("Privacy updated");
  };

  const handleEdit = (id: string, title: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, title } : img));
    showToast("Image title updated");
  };

  const handleDelete = (item: ImageItem) => {
    setImages(prev => prev.filter(img => img.id !== item.id));
    setDeleteItem(null);
    showToast("Image deleted", "error");
  };

  const handleUpload = (files: UploadFile[]) => {
    const GRADIENTS = [
      "linear-gradient(135deg,#667EEA,#764BA2)",
      "linear-gradient(135deg,#F093FB,#F5576C)",
      "linear-gradient(135deg,#4FACFE,#00F2FE)",
      "linear-gradient(135deg,#43E97B,#38F9D7)",
      "linear-gradient(135deg,#FA709A,#FEE140)",
    ];
    const newImages: ImageItem[] = files.map((f, i) => ({
      id: Math.random().toString(36).slice(2),
      title: f.title,
      bg: GRADIENTS[i % GRADIENTS.length],
      height: 180 + Math.floor(Math.random() * 100),
      isPublic: false,
      uploadedAt: "Just now",
      size: `${(f.file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setImages(prev => [...newImages, ...prev]);
    showToast(`${files.length} image${files.length > 1 ? "s" : ""} uploaded!`);
  };

  const filtered = filterMode === "all" ? images
    : filterMode === "public" ? images.filter(i => i.isPublic)
    : images.filter(i => !i.isPublic);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #C084FC44; border-radius: 99px; }
      `}</style>

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-8"
          style={{ background: "radial-gradient(circle,#C084FC,transparent)" }} />
      </div>

      <Navbar />

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7">
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
              <IconUpload />
              <span>Upload Images</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
          <StatsBar images={images} />
        </motion.div>

        {/* ── Filter tabs ── */}
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
              {mode} {mode === "all" ? `(${images.length})` : mode === "public" ? `(${images.filter(i=>i.isPublic).length})` : `(${images.filter(i=>!i.isPublic).length})`}
            </button>
          ))}
          <div className="ml-auto text-xs font-medium" style={{ color: C.muted }}>
            {filtered.length} image{filtered.length !== 1 ? "s" : ""}
          </div>
        </motion.div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.6)", border: `2px dashed ${C.border}` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,92,252,0.08)", color: C.muted }}>
              <IconImage />
            </div>
            <p className="font-semibold mb-1" style={{ color: C.text }}>No images found</p>
            <p className="text-sm mb-5" style={{ color: C.muted }}>Upload your first image to get started</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 4px 14px rgba(124,92,252,0.28)" }}>
              <IconUpload /> Upload Images
            </motion.button>
          </motion.div>
        )}

        {/* ── Masonry Reorder grid ── */}
        {filtered.length > 0 && (
          <Reorder.Group
            axis="y"
            values={images}
            onReorder={setImages}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            style={{ columnGap: "1rem" }}
            as="div"
          >
            <AnimatePresence>
              {filtered.map(img => (
                <div key={img.id} className="break-inside-avoid mb-4">
                  <ImageCard
                    item={img}
                    onEdit={setEditItem}
                    onDelete={setDeleteItem}
                    onTogglePrivacy={togglePrivacy}
                  />
                </div>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </main>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {editItem && (
          <EditModal item={editItem} onSave={handleEdit} onClose={() => setEditItem(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteItem && (
          <DeleteModal item={deleteItem} onConfirm={() => handleDelete(deleteItem)} onClose={() => setDeleteItem(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {uploadOpen && (
          <UploadModal onClose={() => setUploadOpen(false)} onUpload={handleUpload} />
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl"
            style={{
              background: toast.type === "success"
                ? "linear-gradient(135deg,#7C5CFC,#C084FC)"
                : "linear-gradient(135deg,#FF6B6B,#FF4444)",
              boxShadow: toast.type === "success"
                ? "0 12px 36px rgba(124,92,252,0.35)"
                : "0 12px 36px rgba(255,107,107,0.35)",
            }}>
            <span>{toast.type === "success" ? "✦" : "✕"}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}