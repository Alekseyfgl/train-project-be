import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { checkAccessTokenMiddleware } from '../common/middlewares/auth/auth.middleware';
import { commentToPostValidation } from '../common/express-validators/comment.validator';

export const commentPath = {
    base: '/comments',
    id: ':id',
};
const { base, id } = commentPath;
export const commentRouter = Router();

commentRouter.get(`${base}/${id}`, commentController.getById);
commentRouter.put(`${base}/${id}`, checkAccessTokenMiddleware, commentToPostValidation(), commentController.update);
commentRouter.delete(`${base}/${id}`, checkAccessTokenMiddleware, commentController.delete);
