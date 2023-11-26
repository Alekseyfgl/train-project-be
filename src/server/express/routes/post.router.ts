import { Router } from 'express';
import { authMiddleware } from '../common/middlewares/auth/auth.middleware';
import { postController } from '../controllers/post.controller';
import { postValidation } from '../common/express-validators/post.validator';

export const postPath = {
    base: '/posts',
    id: ':id',
};
const { base, id } = postPath;
export const postRouter = Router();
postRouter.get(`${base}`, postController.getAll);
postRouter.get(`${base}/${id}`, postController.getById);
postRouter.post(`${base}`, authMiddleware, postValidation(), postController.addByOne);
postRouter.put(`${base}/${id}`, authMiddleware, postValidation(), postController.updateById);
postRouter.delete(`${base}/${id}`, authMiddleware, postController.removeById);
