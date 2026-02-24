import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { toast } from "sonner";
import { authService } from "../../../services/api/auth.api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { C } from "../../../components/ui/palette";


type Status = "idle" | "verifying" | "success" | "error";

function StatusIcon({ status }: { status: Status }) {
  const configs = {
    idle: {
      bg: "rgba(124,92,252,0.10)",
      ring: "rgba(124,92,252,0.20)",
      gradient: "linear-gradient(135deg,#7C5CFC,#C084FC)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    verifying: {
      bg: "rgba(124,92,252,0.10)",
      ring: "rgba(124,92,252,0.20)",
      gradient: "linear-gradient(135deg,#7C5CFC,#C084FC)",
      icon: (
        <svg className="w-7 h-7 animate-spin" fill="none" stroke="#fff" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" strokeOpacity="0.25" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 2a10 10 0 0110 10" />
        </svg>
      ),
    },
    success: {
      bg: "rgba(34,197,94,0.10)",
      ring: "rgba(34,197,94,0.20)",
      gradient: "linear-gradient(135deg,#22C55E,#16A34A)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "rgba(255,107,107,0.10)",
      ring: "rgba(255,107,107,0.20)",
      gradient: "linear-gradient(135deg,#FF6B6B,#FF4444)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="#fff" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };

  const cfg = configs[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div key={status}
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative flex items-center justify-center mx-auto"
        style={{ width: 80, height: 80 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: cfg.ring }} />
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: cfg.gradient, boxShadow: `0 8px 24px ${cfg.ring}` }}>
          {cfg.icon}
        </div>
        {status === "success" && (
          <>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.cos((deg * Math.PI) / 180) * 36, y: Math.sin((deg * Math.PI) / 180) * 36 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ background: i % 2 === 0 ? "#7C5CFC" : "#22C55E" }} />
            ))}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Click the button below to verify your email address");
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. Please check your email.");
    }
  }, [email, token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Verifying your email...");
      const res = await authService.verifyEmail(email as string, token as string);
      if (res && res.status) {
        setVerificationStatus("success");
        setMessage(res.message || "Email verified successfully!");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/auth/sign-in"), 3000);
      } else {
        setVerificationStatus("error");
        setMessage(res.message || "Verification failed. Please try again.");
        toast.error(res.message || "Verification failed");
      }
    } catch (error: any) {
        console.log(error.message, "err mesage verify")
      const msg = error.message || "Verification failed. Please try again.";
      toast.error(msg);
      setVerificationStatus("error");
      setMessage(msg);
    }
  };

  const handleResendEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Sending verification email...");
      const res = await authService.resendEmailVerification(email as string);
      if (res && res.status) {
        setVerificationStatus("idle");
        setMessage("Verification email sent! Please check your inbox.");
        toast.success("Verification email sent successfully!");
      } else {
        setVerificationStatus("error");
        setMessage(res.data?.message || "Failed to send verification email.");
        toast.error(res.data?.message || "Failed to send verification email");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to send verification email.";
      setVerificationStatus("error");
      setMessage(msg);
      toast.error(msg);
    }
  };

  const titles: Record<Status, string> = {
    idle: "Verify Your Email",
    verifying: "Verifying...",
    success: "Email Verified!",
    error: "Verification Failed",
  };
  const subtitles: Record<Status, string> = {
    idle: "One click away from your creative canvas",
    verifying: "Please wait a moment",
    success: "Redirecting you to login shortly",
    error: "Something went wrong",
  };

  const msgStyle: Record<Status, { bg: string; border: string; color: string }> = {
    idle:      { bg: "rgba(124,92,252,0.05)", border: "rgba(124,92,252,0.15)", color: C.muted },
    verifying: { bg: "rgba(124,92,252,0.05)", border: "rgba(124,92,252,0.15)", color: C.muted },
    success:   { bg: "rgba(34,197,94,0.06)",  border: "rgba(34,197,94,0.18)",  color: "#15803D" },
    error:     { bg: "rgba(255,107,107,0.06)", border: "rgba(255,107,107,0.18)", color: "#DC2626" },
  };

  const ms = msgStyle[verificationStatus];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#C084FC,transparent)" }} />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,#FF6B6B,transparent)" }} />
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
          boxShadow: "0 24px 64px rgba(124,92,252,0.12), 0 4px 20px rgba(0,0,0,0.05)",
          padding: "36px 32px",
        }}>

        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.9"/>
                <rect x="9" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.6"/>
                <rect x="1" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.6"/>
                <rect x="9" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: C.text, letterSpacing: "-0.02em" }}>Pixel Stock</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="h-px w-full mb-6" style={{ background: C.border }} />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5">
          <StatusIcon status={verificationStatus} />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-5">
          <AnimatePresence mode="wait">
            <motion.h1 key={titles[verificationStatus]}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="display font-bold text-2xl sm:text-3xl mb-1.5"
              style={{ color: C.text }}>
              {titles[verificationStatus]}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p key={subtitles[verificationStatus]}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-sm" style={{ color: C.muted }}>
              {subtitles[verificationStatus]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5">
          <AnimatePresence mode="wait">
            <motion.div key={message}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 py-3 rounded-2xl text-center text-sm font-medium"
              style={{ background: ms.bg, border: `1px solid ${ms.border}`, color: ms.color }}>
              {verificationStatus === "verifying" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: `${C.accent1} ${C.accent1} ${C.accent1} transparent` }} />
                  <span>{message}</span>
                </div>
              ) : (
                message
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {verificationStatus === "success" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }}
              className="mb-5 overflow-hidden">
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(124,92,252,0.07)", border: `1px solid rgba(124,92,252,0.12)` }}>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg,#7C5CFC,#C084FC)" }} />
                <p className="text-xs text-center py-2" style={{ color: C.muted }}>
                  Redirecting to login in 3 seconds…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          {verificationStatus === "idle" && (
            <motion.button onClick={verifyEmail}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-shadow"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)" }}>
              Verify My Email →
            </motion.button>
          )}

          {verificationStatus === "success" && (
            <motion.button onClick={() => navigate("/auth/login")}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)" }}>
              Go to Login →
            </motion.button>
          )}

          {verificationStatus === "error" && (
            <>
              <motion.button onClick={() => navigate("/auth/login")}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 28px rgba(124,92,252,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 18px rgba(124,92,252,0.28)" }}>
                Go to Login
              </motion.button>
              <motion.button onClick={handleResendEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-2xl text-sm font-semibold border transition-colors"
                style={{ color: C.accent1, borderColor: "rgba(124,92,252,0.25)", background: "rgba(124,92,252,0.04)" }}>
                Resend Verification Email
              </motion.button>
            </>
          )}
        </motion.div>

        {email && (
          <motion.div variants={itemVariants} className="mt-5 px-4 py-2.5 rounded-xl text-center"
            style={{ background: "rgba(124,92,252,0.04)", border: `1px solid rgba(124,92,252,0.10)` }}>
            <p className="text-xs" style={{ color: C.muted }}>
              Verifying for{" "}
              <span className="font-semibold font-mono" style={{ color: C.text }}>{email}</span>
            </p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-5 text-center">
          <Link to="/auth/login"
            className="text-xs font-medium transition-colors"
            style={{ color: C.accent1 }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
            ← Back to Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}