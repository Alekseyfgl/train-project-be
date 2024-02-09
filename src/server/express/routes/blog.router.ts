import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { BasicAuthMiddleware } from '../common/middlewares/auth/basicAuthMiddleware';
import { blogValidation } from '../common/express-validators/blog.validator';
import { addPostToBlogValidation } from '../common/express-validators/post.validator';

export const blogPath = {
    base: '/blogs',
    id: ':id',
};
const { base, id } = blogPath;
export const blogRouter = Router();
blogRouter.get(`${base}`, blogController.getAllBlogs);
blogRouter.get(`${base}/${id}`, blogController.getBlogById);
blogRouter.post(`${base}`, BasicAuthMiddleware, blogValidation(), blogController.addBlogByOne);
blogRouter.put(`${base}/${id}`, BasicAuthMiddleware, blogValidation(), blogController.updateBlogById);
blogRouter.post(`${base}/${id}/posts`, BasicAuthMiddleware, addPostToBlogValidation(), blogController.createPostToBlog);
blogRouter.get(`${base}/${id}/posts`, blogController.getAllPostsByBlogId);
blogRouter.delete(`${base}/${id}`, BasicAuthMiddleware, blogController.removeBlogById);
