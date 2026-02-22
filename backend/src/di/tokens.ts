import { Token } from "typedi";
import { IAuthService } from "@/services/interfaces/auth.Iservice";
import { IUserRepository } from "@/repositories/interfaces/user.Irepository";

export const TOKENS = {
    AuthService: new Token<IAuthService>("AuthService"),
    
    UserRepository: new Token<IUserRepository>("UserRepository"),
  
};

