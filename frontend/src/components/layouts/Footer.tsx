import { motion } from "framer-motion";
import { C } from "../ui/palette";

export default function Footer() {
  const navLinks = ["Explore", "Upload", "About", "Contact"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Settings"];
  const socials = [
    { label: "Twitter/X",  path: "M4 4l8 8M12 4l-8 8" },
    { label: "Instagram",  path: "M12 8a4 4 0 11-8 0 4 4 0 018 0zm0 0v.5A3.5 3.5 0 0015.5 5H16" },
    {
      label: "GitHub",
      path: "M8 2C4.686 2 2 4.686 2 8c0 2.65 1.719 4.9 4.1 5.69.3.055.41-.13.41-.29v-1.01c-1.67.364-2.02-.81-2.02-.81-.273-.695-.668-.88-.668-.88-.546-.374.041-.366.041-.366.604.042.922.62.922.62.537.92 1.41.654 1.754.5.055-.39.21-.654.382-.804-1.332-.15-2.732-.666-2.732-2.96 0-.654.234-1.188.618-1.607-.062-.15-.268-.76.058-1.585 0 0 .504-.162 1.65.616a5.7 5.7 0 011.5-.202c.51.002 1.022.069 1.5.202 1.145-.778 1.648-.616 1.648-.616.328.825.122 1.435.06 1.585.385.42.617.953.617 1.607 0 2.302-1.403 2.808-2.74 2.955.216.186.408.552.408 1.113v1.648c0 .162.108.35.414.29C12.283 12.898 14 10.648 14 8c0-3.314-2.686-6-6-6z",
    },
  ];

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "rgba(124,92,252,0.10)",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10 sm:mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: C.text }}>
                Pixel Stock
              </div>
              <div className="text-[11px] leading-tight mt-0.5" style={{ color: C.muted }}>
                Your Creative Canvas
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((l) => (
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

          <div className="flex gap-2.5 shrink-0">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href="#"
                aria-label={s.label}
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-9 h-9 rounded-xl border flex items-center justify-center"
                style={{
                  background: "rgba(124,92,252,0.06)",
                  borderColor: "rgba(124,92,252,0.14)",
                  color: C.muted,
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d={s.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "rgba(124,92,252,0.08)" }} />

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: C.muted }}>
            © 2026 Pixel Stock, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {legalLinks.map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs transition-colors hover:text-purple-600"
                style={{ color: C.muted }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
