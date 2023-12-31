import { Router } from 'express';
import { userController } from '../controllers/auth.controller';
import { loginValidation, registrationValidation } from '../common/express-validators/auth.validator';
import { authMiddleware_jwt } from '../common/middlewares/auth/auth.middleware';

export const authPath = {
    base: '/auth',
    login: 'login',
    registration: 'registration',
    me: 'me',
    id: ':id',
};
const { base, login, id, me, registration } = authPath;
export const authRouter = Router();
authRouter.post(`${base}/${login}`, loginValidation(), userController.login);
authRouter.post(`${base}/${registration}`, registrationValidation(), userController.registration);
authRouter.get(`${base}/${me}`, authMiddleware_jwt, userController.me);
