import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import Navbar from "../../../components/layouts/Navbar";
import { userService, type UserProfile } from "../../../services/api/user.api";
import { C } from "../../../components/ui/palette";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema, type UpdateProfileSchemaType,
  changePasswordSchema, type ChangePasswordSchemaType,
} from "../../../lib/validations/auth.z.validation";
import type { Value as PhoneValue } from "react-phone-number-input";

import {
  ProfileHero,
  ProfileSidebar,
  ProfileConfirmModal,
  PersonalInfoForm,
  SecurityForm,
} from "../../../components/profile";
import type { ProfileSection } from "../../../components/profile";

const slideIn: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, x: -16, transition: { duration: 0.22 } },
};

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-2xl opacity-15" style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="#7C5CFC" strokeWidth={2.5} strokeLinecap="round">
              <path d="M12 2a10 10 0 0110 10" />
            </svg>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Loading</p>
      </div>
    </div>
  );
}

export const Profile = () => {
  const [user, setUser]               = useState<UserProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [section, setSection]         = useState<ProfileSection>("info");
  const [isEditing, setIsEditing]     = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const pendingPwData = React.useRef<ChangePasswordSchemaType | null>(null);

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    control: profileControl,
    reset: resetProfile,
    formState: { errors: pErr },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
  });

  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErr },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        resetProfile({
          firstName: res.user.firstName || "",
          lastName:  res.user.lastName  || "",
          email:     res.user.email     || "",
          phone:     (res.user.phone as PhoneValue) || undefined,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onSaveProfile = async (data: UpdateProfileSchemaType) => {
    try {
      setIsSaving(true);
      const res = await userService.updateProfile({
        firstName: data.firstName,
        lastName:  data.lastName,
        phone:     data.phone || "",
      });
      if (res.success && res.user) {
        setUser(res.user);
        setIsEditing(false);
        toast.success("Profile updated");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = (data: ChangePasswordSchemaType) => {
    pendingPwData.current = data;
    setShowPwModal(true);
  };

  const confirmChangePassword = async () => {
    const data = pendingPwData.current;
    if (!data) return;
    setShowPwModal(false);
    try {
      setIsChangingPw(true);
      const res = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      });
      if (res.success) {
        toast.success("Password changed");
        resetPw();
        pendingPwData.current = null;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsChangingPw(false);
    }
  };

  if (loading) return <Spinner />;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <div className="text-center">
        <p className="font-semibold mb-2" style={{ color: C.text }}>Couldn't load profile</p>
        <button onClick={fetchProfile} className="text-sm font-semibold" style={{ color: C.accent1 }}>
          Retry →
        </button>
      </div>
    </div>
  );

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        .display { font-family: 'Sora', sans-serif; }
        .PhoneInput { display:flex; align-items:center; background:rgba(248,247,255,0.9); border:1.5px solid rgba(120,100,220,0.14); border-radius:16px; padding:0 16px; height:48px; width:100%; transition:all 0.2s; }
        .PhoneInput:focus-within { border-color:#7C5CFC; box-shadow:0 0 0 3px rgba(124,92,252,0.09); }
        .PhoneInputInput { border:none; background:transparent; outline:none; font-size:0.875rem; font-weight:500; color:#1a1035; flex:1; padding:0 10px; }
        .PhoneInputCountryIcon { width:20px; height:15px; border-radius:2px; }
        .PhoneInputCountrySelectArrow { margin-left:4px; opacity:0.4; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.07]"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent)" }} />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05]"
          style={{ background: "radial-gradient(circle,#C084FC,transparent)" }} />
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <ProfileHero user={user} fullName={fullName} />

          <div className="flex flex-col lg:flex-row gap-5 items-start">

            <ProfileSidebar
              section={section}
              user={user}
              onSectionChange={(s) => { setSection(s); setIsEditing(false); }}
            />

            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">

                {section === "info" && (
                  <motion.div key="info" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                    <PersonalInfoForm
                      user={user}
                      isEditing={isEditing}
                      isSaving={isSaving}
                      errors={pErr}
                      register={regProfile}
                      control={profileControl}
                      onEdit={() => setIsEditing(true)}
                      onDiscard={() => setIsEditing(false)}
                      onSubmit={handleProfileSubmit(onSaveProfile)}
                      resetProfile={resetProfile}
                    />
                  </motion.div>
                )}

                {section === "password" && (
                  <motion.div key="password" variants={slideIn} initial="hidden" animate="visible" exit="exit">
                    <SecurityForm
                      isChangingPw={isChangingPw}
                      errors={pwErr}
                      register={regPw}
                      onSubmit={handlePwSubmit(onChangePassword)}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <ProfileConfirmModal
        open={showPwModal}
        onClose={() => setShowPwModal(false)}
        onConfirm={confirmChangePassword}
        loading={isChangingPw}
      />
    </div>
  );
};