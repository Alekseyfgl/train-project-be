import { Router } from 'express';
import { userController } from '../controllers/auth.controller';
import { loginValidation, registrationValidation } from '../common/express-validators/auth.validator';
import { checkAccessTokenMiddleware, checkRefreshTokenMiddleware } from '../common/middlewares/auth/auth.middleware';

export const authPath = {
    base: '/auth',
    login: 'login',
    registration: 'registration',
    confirmation: 'registration-confirmation',
    resendEmail: 'registration-email-resending',
    refreshToken: 'refresh-token',
    logout: 'logout',
    me: 'me',
    id: ':id',
};
const { base, login, id, me, registration, confirmation, resendEmail, refreshToken, logout } = authPath;

export const authRouter = Router();
authRouter.post(`${base}/${login}`, loginValidation(), userController.login);
authRouter.post(`${base}/${registration}`, registrationValidation() as any, userController.registration);
authRouter.post(`${base}/${confirmation}`, userController.confirmRegistration);
authRouter.post(`${base}/${resendEmail}`, userController.resendEmail);
authRouter.post(`${base}/${refreshToken}`, checkRefreshTokenMiddleware, userController.refreshToken);
authRouter.post(`${base}/${logout}`, checkRefreshTokenMiddleware, userController.logout);
authRouter.get(`${base}/${me}`, checkAccessTokenMiddleware, userController.me);
