import { Router } from 'express';

import { login, loginInputSchema, profile, register, registerInputSchema } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';

const authRouter = Router();

authRouter.post('/register', validateRequest(registerInputSchema), asyncHandler(register));
authRouter.post('/login', validateRequest(loginInputSchema), asyncHandler(login));
authRouter.get('/profile', requireAuth, asyncHandler(profile));

export default authRouter;
