import { Token } from "typedi";
import { IAuthService } from "@/services/interfaces/auth.Iservice";
import { IUserRepository } from "@/repositories/interfaces/user.Irepository";
import { IUserService } from "@/services/interfaces/user.Iservice";

export const TOKENS = {
    AuthService: new Token<IAuthService>("AuthService"),
    UserService: new Token<IUserService>("UserService"),
    
    UserRepository: new Token<IUserRepository>("UserRepository"),
  
};

