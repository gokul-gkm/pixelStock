import { motion, AnimatePresence } from "framer-motion";
import { C } from "../ui/palette";
import { IShield } from "./icons";

interface ProfileConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function ProfileConfirmModal({ open, onClose, onConfirm, loading }: ProfileConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-xs rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 32px 80px rgba(124,92,252,0.22)" }}
          >
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#7C5CFC,#C084FC,#FF6B6B)" }} />
            <div className="p-7" style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(24px)" }}>
              <div
                className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.15)", color: C.accent1 }}
              >
                <IShield />
              </div>
              <h3 className="display font-bold text-base text-center mb-1" style={{ color: C.text }}>
                Confirm password change
              </h3>
              <p className="text-xs text-center mb-6 leading-relaxed" style={{ color: C.muted }}>
                This will update your login credentials immediately.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors hover:bg-purple-50"
                  style={{ color: C.muted, borderColor: "rgba(120,100,220,0.15)" }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: loading ? "#C4B5FD" : "linear-gradient(135deg,#7C5CFC,#C084FC)",
                    boxShadow: loading ? "none" : "0 4px 14px rgba(124,92,252,0.32)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "#fff #fff #fff transparent" }} />
                      Updating…
                    </span>
                  ) : "Yes, update it"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
