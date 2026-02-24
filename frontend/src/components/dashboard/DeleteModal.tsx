import { motion } from "framer-motion";
import { C } from "../ui/palette";
import type { ImageItem } from "../../services/api/image.api";
import { IconTrash, IconSpin } from "../ui/icons";

interface DeleteModalProps {
  item: ImageItem;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteModal({ item, deleting, onConfirm, onClose }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-6"
        style={{ background: C.surface, backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, boxShadow: "0 24px 64px rgba(255,107,107,0.18)" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,107,107,0.12)", color: "#FF6B6B" }}
        >
          <IconTrash size={18} />
        </div>
        <h3 className="display font-bold text-lg text-center mb-1.5" style={{ color: C.text }}>
          Delete Image?
        </h3>
        <p className="text-sm text-center mb-5" style={{ color: C.muted }}>
          "<span className="font-semibold" style={{ color: C.text }}>{item.title}</span>" will be permanently removed from Cloudinary.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ color: C.muted, borderColor: C.border }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#FF6B6B,#FF4444)", boxShadow: "0 6px 18px rgba(255,107,107,0.3)", opacity: deleting ? 0.7 : 1 }}
          >
            {deleting ? <><IconSpin />Deleting…</> : "Delete"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
