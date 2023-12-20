import { Router } from 'express';
import { userController } from '../controllers/auth.controller';
import { loginValidation } from '../common/express-validators/auth.validator';

export const authPath = {
    base: '/auth',
    login: 'login',
    id: ':id',
};
const { base, login, id } = authPath;
export const authRouter = Router();
authRouter.post(`${base}/${login}`, loginValidation(), userController.login);
