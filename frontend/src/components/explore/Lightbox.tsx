import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ExploreImage } from "../../services/api/image.api";
import { IconSpin, IconDownload, IconClose, IconArrowLeft, IconArrowRight } from "../ui/icons";
import { downloadImage } from "./utils";

interface LightboxProps {
  images: ExploreImage[];
  index: number;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
}

export function Lightbox({ images, index, onClose, onNav }: LightboxProps) {
  const img = images[index];
  const [dlLoading, setDlLoading] = useState(false);

  const handleDownload = async () => {
    setDlLoading(true);
    await downloadImage(img.imageUrl, img.title);
    setDlLoading(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNav]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        key={img._id}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 flex flex-col items-center max-w-4xl w-full mx-4"
      >
        <img
          src={img.imageUrl}
          alt={img.title}
          className="rounded-2xl max-h-[75vh] max-w-full object-contain shadow-2xl"
          style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
        />
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="font-semibold text-white text-lg">{img.title}</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              {index + 1} / {images.length}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleDownload}
            disabled={dlLoading}
            title="Download image"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(124,92,252,0.35)",
              opacity: dlLoading ? 0.7 : 1,
            }}
          >
            {dlLoading ? (
              <><IconSpin />Downloading…</>
            ) : (
              <><IconDownload size={16} />Download</>
            )}
          </motion.button>
        </div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-xl flex items-center justify-center text-white"
        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
      >
        <IconClose />
      </button>

      {index > 0 && (
        <button
          onClick={() => onNav(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
        >
          <IconArrowLeft />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          onClick={() => onNav(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
        >
          <IconArrowRight />
        </button>
      )}
    </div>
  );
}
