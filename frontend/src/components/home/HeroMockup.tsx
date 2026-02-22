import { motion } from "framer-motion";
import { IMAGES } from "../ui/data";

/* ─── HERO BROWSER MOCKUP ────────────────────────────────────── */
export default function HeroMockup() {
  const floaters = [
    { bg: "linear-gradient(135deg,#667EEA,#764BA2)", wPct: 18, hPct: 26, xPct: -2,  yPct: 14, rot: -6 },
    { bg: "linear-gradient(135deg,#F093FB,#F5576C)", wPct: 15, hPct: 34, xPct: 82,  yPct: -5, rot: 5  },
    { bg: "linear-gradient(135deg,#4FACFE,#00F2FE)", wPct: 17, hPct: 22, xPct: 66,  yPct: 18, rot: -3 },
    { bg: "linear-gradient(135deg,#43E97B,#38F9D7)", wPct: 13, hPct: 30, xPct: 33,  yPct: 66, rot: 4  },
    { bg: "linear-gradient(135deg,#FA709A,#FEE140)", wPct: 18, hPct: 26, xPct: 52,  yPct: 70, rot: -5 },
  ];

  return (
    <div
      className="relative w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto"
      style={{ paddingTop: "48%" }}
    >
      {/* Browser Chrome */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 rounded-2xl sm:rounded-3xl border overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(124,92,252,0.15)",
          boxShadow: "0 32px 80px rgba(124,92,252,0.18), 0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b"
          style={{
            borderColor: "rgba(124,92,252,0.08)",
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
          <div className="ml-2 flex-1 bg-gray-100 rounded-full h-4 flex items-center px-2.5">
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
              pixelstock.app/gallery
            </span>
          </div>
        </div>

        {/* Masonry Grid Preview */}
        <div className="p-3 sm:p-4">
          <div className="columns-3 gap-1.5 sm:gap-2">
            {IMAGES.slice(0, 6).map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl relative overflow-hidden cursor-pointer"
                style={{ background: img.bg, height: img.h * 0.38 }}
              >
                {img.priv && (
                  <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-sm rounded px-1 py-0.5">
                    <span className="text-[8px] text-white font-semibold">🔒</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Cards */}
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: f.rot, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.8 + i * 0.12, duration: 0.5 },
            scale:   { delay: 0.8 + i * 0.12, duration: 0.5 },
            rotate:  { delay: 0.8 + i * 0.12, duration: 0.5 },
            y: { repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut", delay: i * 0.4 },
          }}
          className="absolute rounded-xl sm:rounded-2xl"
          style={{
            background: f.bg,
            width: `${f.wPct}%`,
            paddingTop: `${f.hPct}%`,
            left: `${f.xPct}%`,
            top: `${f.yPct}%`,
            zIndex: 10 + i,
            boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
          }}
        />
      ))}
    </div>
  );
}
