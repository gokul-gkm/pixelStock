import React, { useState } from "react";
import { motion } from "framer-motion";
import { C } from "../ui/palette";
import { IEye } from "./icons";

export interface ProfileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  readOnly?: boolean;
}

export const ProfileField = React.forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, hint, error, readOnly, ...props }, ref) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
          {label}
        </label>
        {hint && <span className="text-[10px]" style={{ color: C.muted }}>{hint}</span>}
      </div>
      <input
        ref={ref}
        readOnly={readOnly}
        {...props}
        className="w-full px-4 py-3 text-sm font-medium outline-none transition-all duration-200 rounded-2xl"
        style={{
          background: readOnly ? "rgba(124,92,252,0.03)" : "rgba(248,247,255,0.9)",
          border: `1.5px solid ${error ? "#FF6B6B" : "rgba(120,100,220,0.14)"}`,
          color: readOnly ? C.muted : C.text,
          cursor: readOnly ? "not-allowed" : "text",
        }}
        onFocus={e => {
          if (!readOnly) {
            e.currentTarget.style.borderColor = C.accent1;
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.09)";
          }
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? "#FF6B6B" : "rgba(120,100,220,0.14)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-semibold mt-1.5 ml-1"
          style={{ color: "#FF6B6B" }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
);
ProfileField.displayName = "ProfileField";

export interface ProfilePwFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export const ProfilePwField = React.forwardRef<HTMLInputElement, ProfilePwFieldProps>(
  ({ label, error, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.muted }}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            {...props}
            className="w-full px-4 py-3 pr-11 text-sm font-medium outline-none transition-all duration-200 rounded-2xl"
            style={{
              background: "rgba(248,247,255,0.9)",
              border: `1.5px solid ${error ? "#FF6B6B" : "rgba(120,100,220,0.14)"}`,
              color: C.text,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = C.accent1;
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.09)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? "#FF6B6B" : "rgba(120,100,220,0.14)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: show ? C.accent1 : C.muted }}
          >
            <IEye open={show} />
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-semibold mt-1.5 ml-1"
            style={{ color: "#FF6B6B" }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
ProfilePwField.displayName = "ProfilePwField";
