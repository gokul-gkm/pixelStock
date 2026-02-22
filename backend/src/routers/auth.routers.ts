import { authController } from '@/controllers/implements/auth.controller';
import { Router } from 'express';

const authRoute = Router();

authRoute.post('/sign-up', authController.signUp.bind(authController));

export default authRoute;
