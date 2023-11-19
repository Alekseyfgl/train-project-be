import { Router } from 'express';
import { videoRouter } from './video.router';
import { blogController } from '../controllers/blog.controller';

export const blogPath = {
    base: '/blogs',
    id: ':id',
};
const { base, id } = blogPath;
export const blogRouter = Router({});
videoRouter.get(`${base}`, blogController.getAllBlogs);
videoRouter.get(`${base}/${id}`, blogController.getBlogById);
