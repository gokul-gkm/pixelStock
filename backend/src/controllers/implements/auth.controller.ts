import { Request, Response } from "express";
import { IAuthController } from "../interfaces/auth.Icontroller";
import Container, { Inject, Service } from "typedi";
import { IAuthService } from "@/services/interfaces/auth.Iservice";
import { signUpSchema } from "@/utils/validations/auth.validation";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/utils/customError.utils";
import { responseMessage } from "@/enums/responseMessage";
import { ZodError } from "zod";
import { TOKENS } from "@/di/tokens";

@Service()
export class AuthController implements IAuthController {
  constructor(
    @Inject(TOKENS.AuthService)
    private authService: IAuthService
  ) { }

  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const parsedData = signUpSchema.parse(req.body);
      const user = await this.authService.signUp(parsedData);

      return res
        .status(StatusCodes.CREATED)
        .json({ status: true, message: "Signup successful", data: user });
    } catch (error) {
      if (error instanceof AppError) {
        console.log(error.message);
        return res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
      }

      if (error instanceof ZodError) {
  return res.status(StatusCodes.BAD_REQUEST).json({
    status: false,
    message: "Validation failed",
    errors: error.flatten(),
  });
}

      console.error("Unexpected Error (signUp):", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: responseMessage.ERROR_MESSAGE });
    }
  }
}

export const authController = Container.get(AuthController);
