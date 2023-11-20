import { Router } from 'express';
import { authMiddleware } from '../common/middlewares/auth/auth.middleware';
import { blogValidation } from '../common/express-validators/blog.validator';
import { postController } from '../controllers/post.controller';

export const postPath = {
    base: '/post',
    id: ':id',
};
const { base, id } = postPath;
export const postRouter = Router({});
postRouter.get(`${base}`, postController.getAll);
postRouter.get(`${base}/${id}`, postController.getById);
postRouter.post(`${base}`, authMiddleware, blogValidation(), postController.addByOne);
postRouter.put(`${base}/${id}`, authMiddleware, blogValidation(), postController.updateById);
postRouter.delete(`${base}/${id}`, authMiddleware, postController.removeById);
