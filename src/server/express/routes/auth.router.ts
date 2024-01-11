import { Router } from 'express';
import { userController } from '../controllers/auth.controller';
import { loginValidation, registrationValidation } from '../common/express-validators/auth.validator';
import { authMiddleware_jwt } from '../common/middlewares/auth/auth.middleware';

export const authPath = {
    base: '/auth',
    login: 'login',
    registration: 'registration',
    confirmation: 'registration-confirmation',
    resendEmail: 'registration-email-resending',
    me: 'me',
    id: ':id',
};
const { base, login, id, me, registration, confirmation, resendEmail } = authPath;
export const authRouter = Router();
authRouter.post(`${base}/${login}`, loginValidation(), userController.login);
authRouter.post(`${base}/${registration}`, registrationValidation() as any, userController.registration);
authRouter.post(`${base}/${confirmation}`, userController.confirmRegistration);
authRouter.post(`${base}/${resendEmail}`, userController.resendEmail);
authRouter.get(`${base}/${me}`, authMiddleware_jwt, userController.me);
