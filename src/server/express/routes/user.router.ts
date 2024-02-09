import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { BasicAuthMiddleware } from '../common/middlewares/auth/basicAuthMiddleware';
import { createUserLikeAdminValidation } from '../common/express-validators/users.validator';

export const userPath = {
    base: '/users',
    id: ':id',
};
const { base, id } = userPath;
export const userRouter = Router();
userRouter.get(`${base}`, BasicAuthMiddleware, userController.getAll);
userRouter.post(`${base}`, BasicAuthMiddleware, createUserLikeAdminValidation(), userController.createUser);
userRouter.delete(`${base}/${id}`, BasicAuthMiddleware, userController.removeById);
