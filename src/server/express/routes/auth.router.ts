import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginValidation, recoveryPasswordValidation, registrationValidation, setNewPasswordValidation } from '../common/express-validators/auth.validator';
import { checkAccessTokenMiddleware, checkRefreshTokenMiddleware } from '../common/middlewares/auth/basicAuthMiddleware';
import { rateLimitReqMiddleware } from '../common/middlewares/rate-limit-request/rate-limit-request.middleware';

export const authPath = {
    base: '/auth',
    login: 'login',
    registration: 'registration',
    confirmation: 'registration-confirmation',
    resendEmail: 'registration-email-resending',
    refreshToken: 'refresh-token',
    passwordRecovery: 'password-recovery',
    newPassword: 'new-password',
    logout: 'logout',
    me: 'me',
    id: ':id',
};
const { base, login, id, me, registration, confirmation, resendEmail, refreshToken, logout, passwordRecovery, newPassword } = authPath;

export const authRouter = Router();
authRouter.post(`${base}/${login}`, loginValidation(), rateLimitReqMiddleware, authController.login);
authRouter.post(`${base}/${registration}`, registrationValidation() as any, rateLimitReqMiddleware, authController.registration);
authRouter.post(`${base}/${confirmation}`, rateLimitReqMiddleware, authController.confirmRegistration);
authRouter.post(`${base}/${resendEmail}`, rateLimitReqMiddleware, authController.resendEmail);
authRouter.post(`${base}/${passwordRecovery}`, recoveryPasswordValidation(), rateLimitReqMiddleware, authController.recoveryPassword);
authRouter.post(`${base}/${newPassword}`, setNewPasswordValidation(), rateLimitReqMiddleware, authController.changePassword);
authRouter.post(`${base}/${refreshToken}`, checkRefreshTokenMiddleware, authController.refreshToken);
authRouter.post(`${base}/${logout}`, checkRefreshTokenMiddleware, authController.logout);
authRouter.get(`${base}/${me}`, checkAccessTokenMiddleware, authController.me);
