import AuthLayout from "../../../components/ui/AuthLayout";
import { AuthInput, AuthButton } from "../../../components/ui/AuthUI";
import { C } from "../../../components/ui/palette";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your details to access your creative workspace"
      linkDescription="Don't have an account?"
      linkText="Sign up for free"
      linkHref="/auth/sign-up"
    >
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <AuthInput 
          label="Email or Username" 
          placeholder="alex@example.com"
          required
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
          }
        />
        
        <div className="flex flex-col gap-1.5">
          <AuthInput 
            label="Password" 
            type="password"
            placeholder="••••••••"
            required
            icon={
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
            }
          />
          <div className="flex justify-end">
            <Link 
              to="#" 
              className="text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-purple-600"
              style={{ color: C.muted }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
          />
          <label htmlFor="remember" className="text-xs font-medium cursor-pointer" style={{ color: C.muted }}>
            Remember me for 30 days
          </label>
        </div>

        <AuthButton>
          Sign In to Pixel Stock
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
