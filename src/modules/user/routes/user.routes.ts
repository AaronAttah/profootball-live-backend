import { Router } from 'express';
import { authJWT } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { getMe, updatePassword, updateProfile } from '../controller/user.controller';
import {updatePasswordSchema, updateProfileSchema } from '../validation/user.schema';
import { asyncHandler } from '../../../middleware/asyncHandler';

export const userRouter = Router();

userRouter.get('/me', authJWT, asyncHandler(getMe));
userRouter.patch('/me/profile', authJWT, validate(updateProfileSchema), asyncHandler(updateProfile));
userRouter.patch('/me/password', authJWT, validate(updatePasswordSchema), asyncHandler(updatePassword));


