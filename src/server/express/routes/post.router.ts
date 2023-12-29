import { Router } from 'express';
import { authMiddleware, authMiddleware_jwt } from '../common/middlewares/auth/auth.middleware';
import { postController } from '../controllers/post.controller';
import { postValidation } from '../common/express-validators/post.validator';
import { addCommentToPostValidation } from '../common/express-validators/comment.validator';

export const postPath = {
    base: '/posts',
    id: ':id',
    comments: 'comments',
};
const { base, id, comments } = postPath;
export const postRouter = Router();
postRouter.get(`${base}`, postController.getAll);
postRouter.get(`${base}/${id}`, postController.getById);
postRouter.post(`${base}`, authMiddleware, postValidation(), postController.addByOne);
postRouter.post(`${base}/${id}/${comments}`, authMiddleware_jwt, addCommentToPostValidation(), postController.addCommentToPost);
postRouter.put(`${base}/${id}`, authMiddleware, postValidation(), postController.updateById);
postRouter.delete(`${base}/${id}`, authMiddleware, postController.removeById);
