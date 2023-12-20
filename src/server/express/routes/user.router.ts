import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../common/middlewares/auth/auth.middleware';
import { createUserLikeAdminValidation } from '../common/express-validators/users.validator';

export const userPath = {
    base: '/users',
    id: ':id',
};
const { base, id } = userPath;
export const userRouter = Router();
userRouter.get(`${base}`, authMiddleware, userController.getAll);
userRouter.post(`${base}`, authMiddleware, createUserLikeAdminValidation(), userController.createUser);
userRouter.delete(`${base}/${id}`, authMiddleware, userController.removeById);
