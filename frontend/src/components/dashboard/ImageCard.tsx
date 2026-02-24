import React from "react";
import { motion } from "framer-motion";
import type { ImageItem } from "../../services/api/image.api";
import { IconEdit, IconTrash, IconGlobe, IconLock, IconDrag } from "../ui/icons";
import { PrivacyToggle } from "./PrivacyToggle";

interface ImageCardProps {
  item: ImageItem;
  toggleLoading: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onEdit: (item: ImageItem) => void;
  onDelete: (item: ImageItem) => void;
  onTogglePrivacy: (id: string) => void;
}

export function ImageCard({
  item, toggleLoading, isDragging, isDragOver,
  onDragStart, onDragEnter, onDragLeave, onDrop, onDragEnd,
  onEdit, onDelete, onTogglePrivacy,
}: ImageCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.18s" }}
    >
      <motion.div
        className="relative group rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          boxShadow: isDragOver
            ? "0 0 0 3px #7C5CFC, 0 8px 32px rgba(124,92,252,0.18)"
            : "0 4px 20px rgba(0,0,0,0.10)",
          transition: "box-shadow 0.18s",
        }}
        whileHover={!isDragging ? { y: -4 } : {}}
        transition={{ duration: 0.22 }}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full object-cover pointer-events-none"
          style={{ display: "block", minHeight: 180, maxHeight: 340 }}
          loading="lazy"
          draggable={false}
        />

        <div
          className="absolute top-3 left-3 z-20 w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", color: "#fff" }}
        >
          <IconDrag />
        </div>

        <div className="absolute top-3 right-3 z-20">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${
            item.visibility === "public" ? "bg-green-500/80 text-white" : "bg-black/50 text-white"
          }`}>
            {item.visibility === "public" ? <IconGlobe /> : <IconLock />}
            {item.visibility === "public" ? "Public" : "Private"}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-semibold text-sm mb-2 truncate">{item.title}</p>
          <div className="flex items-center justify-between gap-2">
            <PrivacyToggle
              value={item.visibility === "public"}
              onChange={() => onTogglePrivacy(item._id)}
              loading={toggleLoading}
            />
            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className="w-7 h-7 rounded-xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.20)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <IconEdit />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                className="w-7 h-7 rounded-xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: "rgba(255,107,107,0.35)", color: "#fff", border: "1px solid rgba(255,107,107,0.4)" }}
              >
                <IconTrash />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
