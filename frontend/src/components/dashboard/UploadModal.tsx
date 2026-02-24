import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { C } from "../ui/palette";
import { IconClose, IconUpload, IconSpin } from "../ui/icons";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  error: string;
}

interface UploadModalProps {
  uploading: boolean;
  onClose: () => void;
  onUpload: (files: UploadFile[]) => void;
}

export function UploadModal({ uploading, onClose, onUpload }: UploadModalProps) {
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

  const canSave = files.length > 0 && files.every(f => f.title.trim()) && !uploading;

  const handleSave = () => {
    const validated = files.map(f => ({ ...f, error: f.title.trim() ? "" : "Title is required" }));
    if (validated.some(f => f.error)) { setFiles(validated); return; }
    onUpload(files);
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.18 } },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={uploading ? undefined : onClose}
      />

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
      >
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div>
            <h3 className="display font-bold text-lg" style={{ color: C.text }}>Upload Images</h3>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Add a title to each image before saving</p>
          </div>
          <button
            onClick={onClose} disabled={uploading}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,92,252,0.06)", color: C.muted }}
          >
            <IconClose />
          </button>
        </div>

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
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)", color: "#fff" }}
            >
              <IconUpload />
            </div>
            <p className="text-sm font-semibold" style={{ color: C.text }}>Drop images or click to browse</p>
            <p className="text-xs" style={{ color: C.muted }}>PNG, JPG, GIF, WebP up to 10MB each</p>
            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => addFiles(e.target.files)} />
          </motion.div>
        </div>

        {files.length > 0 && (
          <div className="px-6 pt-4 pb-2 overflow-y-auto flex-1" style={{ minHeight: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>
                {files.length} image{files.length > 1 ? "s" : ""} selected
              </p>
              <button onClick={() => setFiles([])} className="text-xs font-medium" style={{ color: "#FF6B6B" }}>
                Clear all
              </button>
            </div>
            <AnimatePresence initial={false}>
              {files.map(f => (
                <motion.div
                  key={f.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                  className="flex items-start gap-3 mb-3 p-3 rounded-2xl"
                  style={{ background: "#F8F7FF", border: `1px solid ${f.error ? "rgba(255,107,107,0.3)" : C.border}` }}
                >
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-purple-100">
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      value={f.title}
                      onChange={e => updateTitle(f.id, e.target.value)}
                      placeholder="Add a title (required)..."
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none"
                      style={{
                        background: "#fff",
                        border: `1.5px solid ${f.error ? "#FF6B6B" : f.title.trim() ? C.accent1 : C.border}`,
                        color: C.text,
                      }}
                    />
                    {f.error && <p className="text-[10px] mt-1 font-medium" style={{ color: "#FF6B6B" }}>{f.error}</p>}
                    <p className="text-[10px] mt-1" style={{ color: C.muted }}>
                      {(f.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(f.id)} disabled={uploading}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(255,107,107,0.1)", color: "#FF6B6B" }}
                  >
                    <IconClose size={10} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div
          className="px-6 py-4 flex gap-3 flex-shrink-0"
          style={{ borderTop: files.length > 0 ? `1px solid ${C.border}` : "none" }}
        >
          <button
            onClick={onClose} disabled={uploading}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold border"
            style={{ color: C.muted, borderColor: C.border }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={canSave ? { scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" } : {}}
            whileTap={canSave ? { scale: 0.97 } : {}}
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
            style={{
              background: canSave ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "#E5E7EB",
              color: canSave ? "#fff" : C.muted,
              boxShadow: canSave ? "0 6px 18px rgba(124,92,252,0.28)" : "none",
            }}
          >
            {uploading
              ? <><IconSpin />Uploading…</>
              : `Save ${files.length > 0 ? `${files.length} Image${files.length > 1 ? "s" : ""}` : "Images"}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
