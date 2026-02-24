import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { C } from "../ui/palette";
import type { ImageItem } from "../../services/api/image.api";
import { IconClose, IconSpin, IconUpload } from "../ui/icons";

interface EditModalProps {
  item: ImageItem;
  saving: boolean;
  onSave: (id: string, title: string, file?: File) => void;
  onClose: () => void;
}

export function EditModal({ item, saving, onSave, onClose }: EditModalProps) {
  const [title, setTitle]         = useState(item.title);
  const [newFile, setNewFile]     = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const canSave = title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-6"
        style={{ background: C.surface, backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, boxShadow: "0 24px 64px rgba(124,92,252,0.18)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="display font-bold text-lg" style={{ color: C.text }}>Edit Image</h3>
          <button
            onClick={onClose} disabled={saving}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,92,252,0.06)", color: C.muted }}
          >
            <IconClose />
          </button>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Image</p>
          <div
            className="relative w-full h-36 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ border: `2px dashed ${newFile ? C.accent1 : "rgba(124,92,252,0.25)"}` }}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={previewUrl ?? item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <IconUpload size={22} />
              <span className="text-white text-xs font-semibold">Change Image</span>
            </div>
            {newFile && (
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                style={{ background: C.accent1, color: "#fff" }}
              >
                New
              </div>
            )}
          </div>
          {newFile && (
            <p className="text-[10px] mt-1.5 font-medium truncate" style={{ color: C.muted }}>
              {newFile.name} · {(newFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all mb-5"
          style={{ background: "#F8F7FF", border: `1.5px solid ${title ? C.accent1 : C.border}`, color: C.text }}
          placeholder="Enter image title..."
        />

        <div className="flex gap-2.5">
          <button
            onClick={onClose} disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ color: C.muted, borderColor: C.border }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { if (canSave) onSave(item._id, title.trim(), newFile ?? undefined); }}
            disabled={!canSave || saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: canSave ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "#E5E7EB",
              color: canSave ? "#fff" : C.muted,
              boxShadow: canSave ? "0 6px 18px rgba(124,92,252,0.28)" : "none",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? <><IconSpin />Saving…</> : "Save Changes"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
