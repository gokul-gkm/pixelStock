import { useForm } from "react-hook-form";
import AuthLayout from "../../../components/ui/AuthLayout";
import { AuthInput, AuthButton } from "../../../components/ui/AuthUI";
import { C } from "../../../components/ui/palette";
import {  Link, useNavigate } from "react-router-dom";
import { signInSchema,type SigninSchemaType } from "../../../lib/validations/auth.z.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../../../services/api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const { register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SigninSchemaType) => {
    try {
          const res = await authService.signin(data);
      localStorage.setItem("access-token", res.accessToken);
    
    useAuthStore.getState().login({
      userName: res.userName,
      email: res.email,
      token: res.accessToken
    });

    toast.success(res.message || "Login successful!");
    navigate('/', {replace: true})
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }

  }
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your details to access your creative workspace"
      linkDescription="Don't have an account?"
      linkText="Sign up for free"
      linkHref="/auth/sign-up"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <AuthInput 
            label="Email or Username" 
            placeholder="alex@example.com"
            {...register("email")}
            required
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            }
          />
          {errors.email && (
            <span className="text-[10px] font-semibold mt-1 ml-1" style={{ color: C.coral }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
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
            {errors.password && (
              <span className="text-[10px] font-semibold mt-1 ml-1" style={{ color: C.coral }}>
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex justify-end">
            <Link 
              to="/auth/forgot-password" 
              className="text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-purple-600"
              style={{ color: C.muted }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <AuthButton loading={isSubmitting}>
           Sign In to Pixel Stock
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
