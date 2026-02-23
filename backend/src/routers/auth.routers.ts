import { authController } from '@/controllers/implements/auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { asyncHandler } from '@/utils/asyncHandler';
import { signUpSchema, signInSchema } from '@/utils/validations/auth.validation';
import { Router } from 'express';

const authRoute = Router();

authRoute.post('/sign-up', validate(signUpSchema), asyncHandler(authController.signUp));
authRoute.post('/sign-in', validate(signInSchema), asyncHandler(authController.signIn));

authRoute.patch('/verify-email', asyncHandler(authController.verifyEmail));
authRoute.post('/logout', asyncHandler(authController.logOut))

authRoute.post('/forgot-password', asyncHandler(authController.forgotPassword))
authRoute.post('/reset-password', asyncHandler(authController.resetPassword))

export default authRoute;
