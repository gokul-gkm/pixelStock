// import { useState } from "react";
import AuthLayout from "../../../components/ui/AuthLayout";
import { AuthInput, AuthButton } from "../../../components/ui/AuthUI";
import { C } from "../../../components/ui/palette";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { signUpSchema, type SignupSchemaType } from "../../../lib/validations/auth.z.validation";
import { authService } from "../../../services/api/auth.api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";


export default function SignUp() {
    // const [phone, setPhone] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(signUpSchema)
    })
    
    const onSubmit = async (data: SignupSchemaType) => {
        try {
            console.log("clicked", data)
            const res = await authService.signup(data);
            toast.success(res.data.message || "Account created!");
            reset();
        } catch (err: any) {
            console.error("Signup error:", err);
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        }
    }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join 10k+ creators and start organizing your gallery today"
      linkDescription="Already have an account?"
      linkText="Sign in"
      linkHref="/auth/sign-in"
    >
      <style>{`
        /* Theming react-phone-number-input */
        .PhoneInput {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(124,92,252,0.12);
          border-radius: 12px;
          padding: 0 16px;
          height: 48px;
          transition: all 0.2s;
        }
        .PhoneInput:focus-within {
          background: white;
          border-color: #7C5CFC;
          box-shadow: 0 0 0 4px rgba(124,92,252,0.05);
        }
        .PhoneInput--error {
          border-color: ${C.coral} !important;
        }
        .PhoneInputInput {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: ${C.text};
          flex: 1;
          padding: 0 10px;
        }
        .PhoneInputCountry {
          margin-right: 8px;
        }
        .PhoneInputCountryIcon {
          width: 20px;
          height: 15px;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .error-text {
          color: ${C.coral};
          font-size: 10px;
          font-weight: 600;
          margin-top: 4px;
          margin-left: 4px;
        }
      `}</style>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <AuthInput 
              label="First Name" 
              placeholder="Alex"
              {...register("firstName")}
              required
            />
            {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
          </div>
          <div className="flex flex-col">
            <AuthInput 
              label="Last Name" 
              placeholder="Rivera"
              {...register("lastName")}
              required
            />
            {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="flex flex-col">
          <AuthInput 
            label="Email Address" 
            type="email"
            placeholder="alex@example.com"
            {...register("email")}
            required
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            }
          />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider pl-1" style={{ color: C.muted }}>
            Phone Number <span style={{ color: C.coral }}>*</span>
          </label>
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
                className={errors.phone ? 'PhoneInput--error' : ''}
                required
              />
            )}
          />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <AuthInput 
              label="Password" 
              type="password"
              placeholder="••••••••"
              {...register("password")}
              required
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                </svg>
              }
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>
          <div className="flex flex-col">
            <AuthInput 
              label="Confirm Password" 
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              required
              icon={
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                </svg>
              }
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-3 py-1">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
              required
            />
            <label htmlFor="terms" className="text-[11px] leading-relaxed" style={{ color: C.muted }}>
              I agree to the <span className="font-bold underline cursor-pointer">Terms of Service</span> and <span className="font-bold underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>
        </div>

        <AuthButton loading={isSubmitting}>
          Create Free Account
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
