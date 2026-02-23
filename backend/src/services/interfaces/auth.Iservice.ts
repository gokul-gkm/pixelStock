import { SignUpDTO, SignInDTO, ForgotPasswordDTO, ResetPaswordDTO } from "@/dtos/auth.dto";
import { AuthResponse, SignInResponse, SignUpResponse } from "@/interfaces/auth.interface";

export interface IAuthService{
  signUp(data: SignUpDTO): Promise<SignUpResponse>;
  verifyEmail(email: string, token: string): Promise<SignInResponse>;
  signIn(data: SignInDTO): Promise<SignInResponse>
  forgotPassword(data: ForgotPasswordDTO): Promise<AuthResponse>
  resetPassword(data: ResetPaswordDTO): Promise<AuthResponse>
}