import { Router } from 'express';
import { authMiddleware, checkAccessTokenMiddleware } from '../common/middlewares/auth/auth.middleware';
import { postController } from '../controllers/post.controller';
import { postValidation } from '../common/express-validators/post.validator';
import { commentToPostValidation } from '../common/express-validators/comment.validator';

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
postRouter.post(`${base}/${id}/${comments}`, checkAccessTokenMiddleware, commentToPostValidation(), postController.addCommentToPost);
postRouter.get(`${base}/${id}/${comments}`, postController.getAllCommentsByPostId);
postRouter.put(`${base}/${id}`, authMiddleware, postValidation(), postController.updateById);
postRouter.delete(`${base}/${id}`, authMiddleware, postController.removeById);
