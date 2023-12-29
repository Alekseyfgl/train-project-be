import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authMiddleware_jwt } from '../common/middlewares/auth/auth.middleware';
import { addCommentToPostValidation } from '../common/express-validators/comment.validator';

export const commentPath = {
    base: '/comments',
    id: ':id',
};
const { base, id } = commentPath;
export const commentRouter = Router();

commentRouter.get(`${base}/${id}`, commentController.getById);
commentRouter.get(`${base}/${id}`, authMiddleware_jwt, addCommentToPostValidation, commentController.update);
