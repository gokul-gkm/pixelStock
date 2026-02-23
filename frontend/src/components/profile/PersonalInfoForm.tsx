import { motion, AnimatePresence } from "framer-motion";
import { Controller, type UseFormRegister, type Control, type FieldErrors } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { C } from "../ui/palette";
import { ProfileField } from "./ProfileField";
import { ProfileSaveBtn } from "./ProfileSaveBtn";
import type { UpdateProfileSchemaType } from "../../lib/validations/auth.z.validation";
import type { UserProfile } from "../../services/api/user.api";
import type { Value as PhoneValue } from "react-phone-number-input";

interface PersonalInfoFormProps {
  user: UserProfile;
  isEditing: boolean;
  isSaving: boolean;
  errors: FieldErrors<UpdateProfileSchemaType>;
  register: UseFormRegister<UpdateProfileSchemaType>;
  control: Control<UpdateProfileSchemaType>;
  onEdit: () => void;
  onDiscard: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetProfile: (values: UpdateProfileSchemaType) => void;
}

const CARD_STYLE = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(120,100,220,0.12)",
  boxShadow: "0 4px 20px rgba(124,92,252,0.06)",
};

export function PersonalInfoForm({
  user, isEditing, isSaving, errors, register, control,
  onEdit, onDiscard, onSubmit,
  resetProfile,
}: PersonalInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">

      <div className="rounded-3xl p-6 sm:p-7" style={CARD_STYLE}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="display font-bold text-sm" style={{ color: C.text }}>Name</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>How you appear to others</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              style={{ color: C.accent1, background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.14)" }}
            >
              Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField
            label="First name" readOnly={!isEditing} placeholder="John"
            error={errors.firstName?.message} {...register("firstName")}
          />
          <ProfileField
            label="Last name" readOnly={!isEditing} placeholder="Smith"
            error={errors.lastName?.message} {...register("lastName")}
          />
        </div>
      </div>

      <div className="rounded-3xl p-6 sm:p-7" style={CARD_STYLE}>
        <div className="mb-5">
          <h2 className="display font-bold text-sm" style={{ color: C.text }}>Contact</h2>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>Email is read-only</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField
            label="Email" type="email" readOnly hint="Read only"
            defaultValue={user.email}
          />
          <div>
            <label
              className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
              style={{ color: C.muted }}
            >
              Phone
            </label>
            {isEditing ? (
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    withCountryCallingCode
                    defaultCountry="IN"
                    placeholder="Enter phone number"
                  />
                )}
              />
            ) : (
              <div
                className="w-full px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "rgba(124,92,252,0.03)", border: "1.5px solid rgba(120,100,220,0.14)", color: C.muted, cursor: "not-allowed" }}
              >
                {user.phone || <span style={{ opacity: 0.4 }}>Not set</span>}
              </div>
            )}
            {errors.phone && (
              <p className="text-[10px] font-semibold mt-1.5 ml-1" style={{ color: "#FF6B6B" }}>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="flex items-center justify-end gap-3"
          >
            <button
              type="button"
              onClick={() => {
                onDiscard();
                resetProfile({
                  firstName: user.firstName || "",
                  lastName:  user.lastName  || "",
                  email:     user.email     || "",
                  phone:     (user.phone as PhoneValue) || "",
                });
              }}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-colors hover:bg-purple-50"
              style={{ color: C.muted, borderColor: "rgba(120,100,220,0.15)" }}
            >
              Discard
            </button>
            <ProfileSaveBtn loading={isSaving} />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
