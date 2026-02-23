import { motion } from "framer-motion";
import type { UserProfile } from "../../services/api/user.api";

interface ProfileHeroProps {
  user: UserProfile;
  fullName: string;
}

export function ProfileHero({ user, fullName }: ProfileHeroProps) {
  const initials = fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="relative rounded-3xl overflow-hidden mb-7 px-6 sm:px-10 py-7"
      style={{
        background: "linear-gradient(135deg,#7C5CFC 0%,#A78BFA 55%,#C084FC 100%)",
        boxShadow: "0 16px 48px rgba(124,92,252,0.26)",
      }}
    >
      <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full border border-white/10" />
      <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full border border-white/10" />
      <div
        className="absolute -bottom-16 left-1/3 w-48 h-48 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle,#fff,transparent)" }}
      />

      <div className="relative z-10 flex items-center gap-5">
        <div
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 select-none"
          style={{
            background: "rgba(255,255,255,0.16)",
            backdropFilter: "blur(12px)",
            border: "2px solid rgba(255,255,255,0.30)",
            letterSpacing: "-0.02em",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 mb-0.5">Profile</p>
          <h1 className="display font-bold text-xl sm:text-2xl text-white truncate">{fullName}</h1>
          <p className="text-white/65 text-sm truncate mt-0.5">{user.email}</p>
        </div>

        <div className="hidden sm:block">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            ✦ Active
          </span>
        </div>
      </div>
    </motion.div>
  );
}
