import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C } from "../ui/palette";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../../services/api/auth.api";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isAuthenticated, userName, email, logout } = useAuthStore();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async() => {
    logout();
    await authService.logOut();
    setProfileOpen(false);
    navigate("/");
  };

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
            scrolled
              ? "bg-white/88 backdrop-blur-2xl border shadow-xl shadow-purple-100/20"
              : "bg-transparent"
          }`}
          style={{ borderColor: scrolled ? "rgba(124,92,252,0.12)" : "transparent" }}
        >
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
            <span
              className="font-bold text-sm"
              style={{ color: C.text, letterSpacing: "-0.02em" }}
            >
              Pixel Stock
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a
              href="/explore"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: C.text }}
            >
              <CompassIcon />
              Explore
            </a>

            <div
              className="w-px h-5 mx-1"
              style={{ background: "rgba(120,100,220,0.15)" }}
            />

            {isAuthenticated && userName ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-colors hover:bg-purple-50"
                  aria-label="Profile menu"
                >
                  <Avatar name={userName} />
                  <span className="text-sm font-semibold max-w-[100px] truncate" style={{ color: C.text }}>
                    {userName.split(" ")[0]}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 12 12"
                    className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    style={{ color: C.muted }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <ProfileDropdown
                      userName={userName}
                      email={email ?? ""}
                      onLogout={handleLogout}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
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
                    className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white whitespace-nowrap block"
                    style={{
                      background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
                      boxShadow: "0 4px 16px rgba(124,92,252,0.34)",
                    }}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && userName && (
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl p-0.5"
                aria-label="Open profile menu"
              >
                <Avatar name={userName} />
              </button>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                background: "rgba(124,92,252,0.06)",
                borderColor: "rgba(124,92,252,0.13)",
              }}
              aria-label="Open menu"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M2 4h12M2 8h12M2 12h12"
                  stroke={C.text}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
        email={email}
        onLogout={handleLogout}
      />
    </>
  );
}

function CompassIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white select-none shadow-md shadow-purple-200/60"
      style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
    >
      {initials}
    </div>
  );
}

function ProfileDropdown({
  userName,
  email,
  onLogout,
}: {
  userName: string;
  email: string;
  onLogout: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl overflow-hidden z-50"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(124,92,252,0.12)",
        boxShadow: "0 12px 48px rgba(124,92,252,0.14), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(124,92,252,0.08)" }}>
        <div className="flex items-center gap-3">
          <Avatar name={userName} />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: C.text }}>
              {userName}
            </p>
            <p className="text-[11px] truncate" style={{ color: C.muted }}>
              {email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-purple-50"
          style={{ color: C.text }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={C.accent1} strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" stroke={C.accent1} strokeWidth="2" />
          </svg>
          View Profile
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors hover:bg-red-50 mt-0.5"
          style={{ color: "#EF4444" }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log out
        </button>
      </div>
    </motion.div>
  );
}

function MobileMenu({
  open,
  onClose,
  isAuthenticated,
  userName,
  email,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userName: string | null;
  email: string | null;
  onLogout: () => void;
}) {
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
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "rgba(124,92,252,0.08)" }}
            >
              <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
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
                <span className="font-bold text-sm" style={{ color: C.text }}>
                  Pixel Stock
                </span>
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

            <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
              <a
                href="/explore"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors hover:bg-purple-50"
                style={{ color: C.text }}
              >
                <CompassIcon />
                Explore
              </a>
            </nav>

            <div className="px-5 pb-8">
              {isAuthenticated && userName ? (
                <>
                  <div
                    className="flex items-center gap-3 p-4 rounded-2xl mb-3"
                    style={{
                      background: "rgba(124,92,252,0.05)",
                      border: "1px solid rgba(124,92,252,0.10)",
                    }}
                  >
                    <Avatar name={userName} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate" style={{ color: C.text }}>
                        {userName}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: C.muted }}>
                        {email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-purple-50 mb-2"
                    style={{ color: C.accent1, borderColor: "rgba(124,92,252,0.22)" }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={C.accent1} strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke={C.accent1} strokeWidth="2" />
                    </svg>
                    View Profile
                  </Link>

                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-red-50"
                    style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
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
                    style={{
                      background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
                      boxShadow: "0 6px 20px rgba(124,92,252,0.32)",
                    }}
                  >
                    Get Started Free →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
