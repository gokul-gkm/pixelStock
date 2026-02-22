import { Inject, Service } from "typedi";
import { IAuthService } from "../interfaces/auth.Iservice";
import { SignUpDTO } from "@/dtos/auth.dto";
import { SignUpResponse } from "@/interfaces/auth.interface";
import { AppError } from "@/utils/customError.utils";
import { StatusCodes } from "http-status-codes";
import { responseMessage } from "@/enums/responseMessage";
import { IUserRepository } from "@/repositories/interfaces/user.Irepository";
import { passwordHash } from "@/utils/password.utils";
import { IUser } from "@/models/user.model";
import { emailVerificationToken } from "@/utils/jwt.utils";
import { sendVerificationEmail } from "@/utils/email.utils";
import { TOKENS } from "@/di/tokens";

@Service({ id: TOKENS.AuthService })
export class AuthService implements IAuthService {
    constructor(
        @Inject(TOKENS.UserRepository)
        private _userRepository: IUserRepository
    ) { }
  async signUp(data: SignUpDTO): Promise<SignUpResponse> {
    try {
      const { firstName, lastName, email, phone, password, confirmPassword } =
        data;
      if (password !== confirmPassword) {
        throw new AppError(
          responseMessage.PASSWORD_UNMATCH,
          StatusCodes.BAD_REQUEST,
        );
      }
      const existingUser = await this._userRepository.findByEmail(email);
      if (existingUser) {
        if (existingUser.is_verified) {
          throw new AppError(
            responseMessage.USER_ALREADY_EXISTS,
            StatusCodes.BAD_REQUEST,
          );
        } else {
          throw new AppError(
            "User already registered but not verified. Please verify your email.",
            StatusCodes.BAD_REQUEST,
          );
        }
      }
      
        const hashedPassword = await passwordHash(password);

        const newUser = await this._userRepository.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        } as IUser);

        const verificationEmailToken = emailVerificationToken(email);

        await sendVerificationEmail({email, name: firstName + lastName, token: verificationEmailToken})
        
        return {
        status: true,
        message: "Success! A verification link was sent to your inbox.",
        email: newUser.email,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      

      throw new AppError(
        responseMessage.ERROR_MESSAGE,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
