import React from "react";
import { motion } from "framer-motion";
import { C } from "./palette";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type = "text", icon, containerClassName = "", required, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        <label className="text-[11px] font-bold uppercase tracking-wider pl-1" style={{ color: C.muted }}>
          {label} {required && <span style={{ color: C.coral }}>*</span>}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-purple-500" style={{ color: C.muted }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            required={required}
            className={`w-full bg-white/50 border rounded-xl py-3 ${icon ? 'pl-11' : 'px-4'} pr-4 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5`}
            style={{ 
              borderColor: "rgba(124,92,252,0.12)",
              color: C.text
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export function AuthButton({ 
  children, 
  loading = false,
  onClick,
  type = "submit"

}: { 
  children: React.ReactNode; 
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type} 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg shadow-purple-200/50 flex items-center justify-center gap-2 overflow-hidden relative group"
      style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </motion.button>
  );
}
