import { SignUpDTO } from "@/dtos/auth.dto";
import { SignUpResponse } from "@/interfaces/auth.interface";

export interface IAuthService{
  signUp(data: SignUpDTO): Promise<SignUpResponse>;
}