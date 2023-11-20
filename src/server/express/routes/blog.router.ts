import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { authMiddleware } from '../common/middlewares/auth/auth.middleware';
import { blogValidation } from '../common/express-validators/blog.validator';

export const blogPath = {
    base: '/blogs',
    id: ':id',
};
const { base, id } = blogPath;
export const blogRouter = Router({});
blogRouter.get(`${base}`, blogController.getAllBlogs);
blogRouter.get(`${base}/${id}`, blogController.getBlogById);
blogRouter.post(`${base}`, authMiddleware, blogValidation(), blogController.addBlogByOne);
blogRouter.put(`${base}/${id}`, authMiddleware, blogValidation(), blogController.updateBlogById);
blogRouter.delete(`${base}/${id}`, authMiddleware, blogController.removeBlogById);
