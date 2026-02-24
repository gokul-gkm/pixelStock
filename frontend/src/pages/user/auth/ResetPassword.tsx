import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authService } from "../../../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetSchema, type ResetSchemaType } from "../../../lib/validations/auth.z.validation";
import { C } from "../../../components/ui/palette";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordInput({
  placeholder,
  hasError,
  hasValue,
  registration,
}: {
  placeholder: string;
  hasError: boolean;
  hasValue: boolean;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...registration}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="new-password"
        className="w-full px-4 py-3 pr-11 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
        style={{
          background: "#F8F7FF",
          border: `1.5px solid ${hasError ? C.coral : hasValue ? C.accent1 : C.border}`,
          color: C.text,
          boxShadow: hasError
            ? "0 0 0 3px rgba(255,107,107,0.10)"
            : hasValue
            ? "0 0 0 3px rgba(124,92,252,0.08)"
            : "none",
        }}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
        style={{ color: show ? C.accent1 : C.muted }}
        tabIndex={-1}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const invalidLink = !email || !token;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetSchemaType>({
      resolver: zodResolver(resetSchema),
      mode: "onChange"
  });

  const newPwVal  = watch("newPassword",     "");
  const confPwVal = watch("confirmPassword", "");

  const onSubmit = async (data: ResetSchemaType) => {
    if (invalidLink) { toast.error("Invalid or missing reset link"); return; }
    try {
      const res = await authService.resetPassword(email, token, data.newPassword, data.confirmPassword);
      toast.success(res.message || "Password reset successfully!");
      navigate("/auth/sign-in", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
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

        <motion.div variants={itemVariants}>
          <div className="h-px w-full mb-6" style={{ background: C.border }} />
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: invalidLink
                ? "linear-gradient(135deg,#FF6B6B,#FF4444)"
                : "linear-gradient(135deg,#7C5CFC,#C084FC)",
              boxShadow: invalidLink
                ? "0 8px 24px rgba(255,107,107,0.28)"
                : "0 8px 24px rgba(124,92,252,0.28)",
            }}
          >
            {invalidLink ? (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            ) : (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="display font-bold text-2xl sm:text-3xl mb-1.5" style={{ color: C.text }}>
            {invalidLink ? "Invalid Reset Link" : "Reset Password"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            {invalidLink
              ? "This link is invalid or has expired."
              : "Choose a strong new password for your account."}
          </p>
        </motion.div>

        <AnimatePresence>
          {invalidLink && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 px-4 py-3.5 rounded-2xl text-sm text-center font-medium"
              style={{
                background: "rgba(255,107,107,0.07)",
                border: "1px solid rgba(255,107,107,0.20)",
                color: "#DC2626",
              }}
            >
              Please request a new password reset link.
            </motion.div>
          )}
        </AnimatePresence>

        {!invalidLink && (
          <form onSubmit={handleSubmit(onSubmit)}>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 rounded-2xl text-sm font-medium"
                style={{
                  background: "rgba(124,92,252,0.04)",
                  border: `1.5px solid ${C.border}`,
                  color: C.muted,
                  cursor: "not-allowed",
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>
                New password
              </label>
              <PasswordInput
                placeholder="At least 8 characters"
                hasError={!!errors.newPassword}
                hasValue={!!newPwVal}
                registration={register("newPassword")}
              />
              {errors.newPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1.5 font-medium" style={{ color: C.coral }}
                >
                  {errors.newPassword.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-5">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted }}>
                Confirm new password
              </label>
              <PasswordInput
                placeholder="Repeat your new password"
                hasError={!!errors.confirmPassword}
                hasValue={!!confPwVal}
                registration={register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1.5 font-medium" style={{ color: C.coral }}
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

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
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "#fff #fff #fff transparent" }}
                    />
                    Resetting…
                  </span>
                ) : (
                  "Reset Password →"
                )}
              </motion.button>
            </motion.div>
          </form>
        )}

        <AnimatePresence>
          {invalidLink && (
            <motion.div
              variants={itemVariants}
              className="mt-4"
            >
              <Link
                to="/auth/forgot-password"
                className="w-full flex items-center justify-center py-3 rounded-2xl text-sm font-semibold border transition-colors"
                style={{ color: C.accent1, borderColor: "rgba(124,92,252,0.22)", background: "rgba(124,92,252,0.04)" }}
              >
                Request a new link →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="mt-5 text-center">
          <p className="text-xs" style={{ color: C.muted }}>
            Remembered your password?{" "}
            <Link
              to="/auth/login"
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