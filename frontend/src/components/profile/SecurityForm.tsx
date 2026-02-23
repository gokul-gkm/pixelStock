import { C } from "../ui/palette";
import { ProfilePwField } from "./ProfileField";
import { ProfileSaveBtn } from "./ProfileSaveBtn";
import { IShield } from "./icons";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ChangePasswordSchemaType } from "../../lib/validations/auth.z.validation";

interface SecurityFormProps {
  isChangingPw: boolean;
  errors: FieldErrors<ChangePasswordSchemaType>;
  register: UseFormRegister<ChangePasswordSchemaType>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function SecurityForm({ isChangingPw, errors, register, onSubmit }: SecurityFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div
        className="rounded-3xl p-6 sm:p-7"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(120,100,220,0.12)",
          boxShadow: "0 4px 20px rgba(124,92,252,0.06)",
        }}
      >
        <div
          className="flex items-center gap-3 mb-6 pb-5"
          style={{ borderBottom: "1px solid rgba(120,100,220,0.09)" }}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.14)", color: C.accent1 }}
          >
            <IShield />
          </div>
          <div>
            <h2 className="display font-bold text-sm" style={{ color: C.text }}>Security</h2>
            <p className="text-xs" style={{ color: C.muted }}>Strong password — at least 8 characters</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProfilePwField
            label="Current password"
            placeholder="Your current password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <div className="h-px" style={{ background: "rgba(120,100,220,0.07)" }} />
          <ProfilePwField
            label="New password"
            placeholder="Min. 8 characters"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <ProfilePwField
            label="Confirm new password"
            placeholder="Repeat new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div
          className="flex justify-end mt-6 pt-5"
          style={{ borderTop: "1px solid rgba(120,100,220,0.09)" }}
        >
          <ProfileSaveBtn loading={isChangingPw} label="Update password" />
        </div>
      </div>

      <div
        className="mt-4 rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{ background: "rgba(124,92,252,0.05)", border: "1px solid rgba(124,92,252,0.11)" }}
      >
        <span className="text-base flex-shrink-0 mt-px">💡</span>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          A strong password uses a mix of uppercase, lowercase, numbers and symbols.
          Avoid using personal info or common phrases.
        </p>
      </div>
    </form>
  );
}
