import { Token } from "typedi";
import { IAuthService } from "@/services/interfaces/auth.Iservice";
import { IUserRepository } from "@/repositories/interfaces/user.Irepository";
import { IUserService } from "@/services/interfaces/user.Iservice";
import { IImageService } from "@/services/interfaces/image.Iservice";
import { IImageRepository } from "@/repositories/interfaces/image.Irepository";

export const TOKENS = {
    AuthService:     new Token<IAuthService>("AuthService"),
    UserService:     new Token<IUserService>("UserService"),
    ImageService:    new Token<IImageService>("ImageService"),

    UserRepository:  new Token<IUserRepository>("UserRepository"),
    ImageRepository: new Token<IImageRepository>("ImageRepository"),
};

