import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authService } from "../../../services/api/auth.api";
import { Link } from "react-router-dom";
import { forgotSchema, type ForgotSchemaType } from "../../../lib/validations/auth.z.validation";
import { C } from "../../../components/ui/palette";


/* ─── PAGE ────────────────────────────────────────────────── */
export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchemaType>({
      resolver: zodResolver(forgotSchema),
      mode: "onChange",
  });

  const emailValue = watch("email", "");

  const onSubmit = async (data: ForgotSchemaType) => {
    try {
      const res = await authService.forgotPassword(data.email);
      toast.success(res.message || "Password reset link sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
      `}</style>

      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.10, 0.20, 0.10] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#C084FC,transparent)" }}
        />
      </div>

      {/* ── Card ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${C.border}`,
          borderRadius: 28,
          padding: "36px 32px",
          boxShadow: "0 24px 64px rgba(124,92,252,0.11), 0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* ── Logo ── */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: C.text, letterSpacing: "-0.02em" }}>
              Pixel Stock
            </span>
          </Link>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div variants={itemVariants}>
          <div className="h-px w-full mb-6" style={{ background: C.border }} />
        </motion.div>

        {/* ── Icon ── */}
        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
              boxShadow: "0 8px 24px rgba(124,92,252,0.28)",
            }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
              <circle cx="12" cy="16" r="1" fill="#fff" stroke="none" />
            </svg>
          </div>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="display font-bold text-2xl sm:text-3xl mb-1.5" style={{ color: C.text }}>
            Forgot Password?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            No worries — enter your email and we'll send<br className="hidden sm:block" /> you a reset link right away.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
              style={{
                background: "#F8F7FF",
                border: `1.5px solid ${errors.email ? C.coral : emailValue ? C.accent1 : C.border}`,
                color: C.text,
                boxShadow: errors.email
                  ? "0 0 0 3px rgba(255,107,107,0.10)"
                  : emailValue
                  ? "0 0 0 3px rgba(124,92,252,0.08)"
                  : "none",
              }}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1.5 font-medium"
                style={{ color: C.coral }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.36)" }}
              whileTap={isSubmitting ? {} : { scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all"
              style={{
                background: isSubmitting
                  ? "#C4B5FD"
                  : "linear-gradient(135deg,#7C5CFC,#C084FC)",
                boxShadow: isSubmitting ? "none" : "0 6px 18px rgba(124,92,252,0.28)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#fff #fff #fff transparent" }}
                  />
                  Sending link…
                </span>
              ) : (
                "Send Reset Link →"
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* ── Back to login ── */}
        <motion.div variants={itemVariants} className="mt-5 text-center">
          <p className="text-xs" style={{ color: C.muted }}>
            Remembered your password?{" "}
            <Link
              to="/auth/sign-in"
              className="font-semibold transition-colors"
              style={{ color: C.accent1 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
            >
              Back to login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}