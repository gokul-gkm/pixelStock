import { motion } from "framer-motion";
import { C } from "../ui/palette";
import { IUser, IShield, IChevron } from "./icons";
import type { UserProfile } from "../../services/api/user.api";

export type ProfileSection = "info" | "password";

interface NavItem {
  id: ProfileSection;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

const NAV: NavItem[] = [
  { id: "info",     label: "Personal Info", icon: <IUser />,   desc: "Name, email & phone" },
  { id: "password", label: "Security",      icon: <IShield />, desc: "Password & access"   },
];

interface ProfileSidebarProps {
  section: ProfileSection;
  user: UserProfile;
  onSectionChange: (section: ProfileSection) => void;
}

export function ProfileSidebar({ section, user, onSectionChange }: ProfileSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      className="w-full lg:w-60 flex-shrink-0 lg:sticky lg:top-28"
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(120,100,220,0.12)",
          boxShadow: "0 4px 20px rgba(124,92,252,0.07)",
        }}
      >
        <div className="p-3">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 pt-2 pb-2"
            style={{ color: C.muted }}
          >
            Settings
          </p>
          {NAV.map(item => {
            const active = section === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: active ? 0 : 2 }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 text-left transition-colors"
                style={{
                  background: active
                    ? "linear-gradient(135deg,rgba(124,92,252,0.11),rgba(192,132,252,0.07))"
                    : "transparent",
                  border: `1px solid ${active ? "rgba(124,92,252,0.16)" : "transparent"}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: active ? "linear-gradient(135deg,#7C5CFC,#C084FC)" : "rgba(124,92,252,0.07)",
                    color: active ? "#fff" : C.muted,
                    boxShadow: active ? "0 4px 10px rgba(124,92,252,0.26)" : "none",
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: active ? C.accent1 : C.text }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: C.muted }}>{item.desc}</p>
                </div>
                {active && <span style={{ color: C.accent1, opacity: 0.6 }}><IChevron /></span>}
              </motion.button>
            );
          })}
        </div>

        <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(120,100,220,0.08)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            Member since
          </p>
          <p className="text-xs font-semibold" style={{ color: C.text }}>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recently joined"}
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
