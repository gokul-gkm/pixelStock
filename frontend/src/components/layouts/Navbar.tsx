import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../ui/palette";
import { Link } from "react-router-dom";

/* ─── MOBILE SLIDE-IN DRAWER ────────────────────────────────── */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 w-72 max-w-[85vw] z-50 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(124,92,252,0.10)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "rgba(124,92,252,0.08)" }}
            >
              <Link to="/" className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
                    <rect x="9" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                    <rect x="1" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                    <rect x="9" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
                  </svg>
                </div>
                <span className="font-bold text-sm" style={{ color: C.text }}>Pixel Stock</span>
              </Link>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,92,252,0.06)" }}
                aria-label="Close menu"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
                  <path d="M2 2l10 10M12 2L2 12" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
              {["Explore", "Pricing", "About", "Blog"].map((l) => (
                <a
                  key={l}
                  href="#"
                  onClick={onClose}
                  className="flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-colors hover:bg-purple-50"
                  style={{ color: C.text }}
                >
                  {l}
                </a>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="px-5 pb-8 flex flex-col gap-3">
              <Link
                to="/auth/sign-in"
                onClick={onClose}
                className="w-full text-center py-3.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-purple-50"
                style={{ color: C.accent1, borderColor: "rgba(124,92,252,0.22)" }}
              >
                Sign in
              </Link>
              <Link
                to="/auth/sign-up"
                onClick={onClose}
                className="w-full text-center py-3.5 rounded-xl text-sm font-semibold text-white shadow-md"
                style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)", boxShadow: "0 6px 20px rgba(124,92,252,0.32)" }}
              >
                Get Started Free →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4"
      >
        <div
          className={`flex items-center justify-between w-full max-w-6xl rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "bg-white/88 backdrop-blur-2xl border shadow-xl shadow-purple-100/20" : "bg-transparent"
          }`}
          style={{ borderColor: scrolled ? "rgba(124,92,252,0.12)" : "transparent" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
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

          {/* Desktop center links */}
          <div className="hidden lg:flex items-center gap-7">
            {["Explore", "Pricing", "About", "Blog"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm font-medium transition-colors hover:text-purple-600"
                style={{ color: C.muted }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/auth/sign-in"
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-purple-50"
              style={{ color: C.accent1 }}
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/auth/sign-up"
                className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white shadow-md whitespace-nowrap block"
                style={{
                  background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
                  boxShadow: "0 4px 16px rgba(124,92,252,0.34)",
                }}
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: "rgba(124,92,252,0.06)", borderColor: "rgba(124,92,252,0.13)" }}
            aria-label="Open menu"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M2 4h12M2 8h12M2 12h12" stroke={C.text} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
