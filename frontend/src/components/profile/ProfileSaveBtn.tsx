import { motion } from "framer-motion";

interface ProfileSaveBtnProps {
  loading: boolean;
  label?: string;
}

export function ProfileSaveBtn({ loading, label = "Save changes" }: ProfileSaveBtnProps) {
  return (
    <motion.button
      type="submit"
      whileHover={loading ? {} : { scale: 1.02, boxShadow: "0 12px 32px rgba(124,92,252,0.34)" }}
      whileTap={loading ? {} : { scale: 0.975 }}
      disabled={loading}
      className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all"
      style={{
        background: loading ? "#C4B5FD" : "linear-gradient(135deg,#7C5CFC,#C084FC)",
        boxShadow: loading ? "none" : "0 6px 20px rgba(124,92,252,0.28)",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#fff #fff #fff transparent" }} />
          Saving…
        </>
      ) : (
        <>{label} →</>
      )}
    </motion.button>
  );
}
