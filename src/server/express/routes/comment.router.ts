import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authMiddleware_jwt } from '../common/middlewares/auth/auth.middleware';
import { commentToPostValidation } from '../common/express-validators/comment.validator';

export const commentPath = {
    base: '/comments',
    id: ':id',
};
const { base, id } = commentPath;
export const commentRouter = Router();

commentRouter.get(`${base}/${id}`, commentController.getById);
commentRouter.put(`${base}/${id}`, authMiddleware_jwt, commentToPostValidation(), commentController.update);
