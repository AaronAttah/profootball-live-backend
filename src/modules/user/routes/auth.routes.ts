import { Router } from 'express';
import { login, signup, refreshToken } from '../controller/auth.controller';
import { asyncHandler } from '../../../middleware/asyncHandler';
import { validate } from '../../../middleware/validate';
import { loginSchema, signupSchema } from '../validation/auth.schema';

export const authRouter = Router();


authRouter.post('/signup', validate(signupSchema), asyncHandler(signup));
authRouter.post('/login', validate(loginSchema), asyncHandler(login));
authRouter.post('/refresh', asyncHandler(refreshToken));
