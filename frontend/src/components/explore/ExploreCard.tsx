import { useState } from "react";
import { motion } from "framer-motion";
import type { ExploreImage } from "../../services/api/image.api";
import { IconSpin, IconDownload } from "../ui/icons";
import { downloadImage } from "./utils";

interface ExploreCardProps {
  image: ExploreImage;
  index: number;
  onClick: () => void;
}

export function ExploreCard({ image, index, onClick }: ExploreCardProps) {
  const [dlLoading, setDlLoading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDlLoading(true);
    await downloadImage(image.imageUrl, image.title);
    setDlLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index % 12, 11) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.10)" }}
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(124,92,252,0.18)" }}
      onClick={onClick}
    >
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full object-cover"
        style={{ display: "block", minHeight: 160, maxHeight: 400 }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white font-semibold text-sm truncate flex-1">{image.title}</p>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            disabled={dlLoading}
            title="Download"
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,255,255,0.20)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              opacity: dlLoading ? 0.6 : 1,
            }}
          >
            {dlLoading ? <IconSpin size={12} /> : <IconDownload size={14} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
