import { NextFunction, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blog.repository';
import { IBlog } from '../types/blog/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';

class BlogController {
    async getAllBlogs(req: Request, res: Response, next: NextFunction) {
        const blogs: IBlog[] = BlogRepository.getAllBlogs();

        new ApiResponse(res).send(HttpStatusCodes.OK, blogs);
    }

    async getBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const blog: Nullable<IBlog> = BlogRepository.findBlockById(id);

        blog ? new ApiResponse(res).send(HttpStatusCodes.OK, blog) : new ApiResponse(res).notFound();
    }

    async addBlogByOne(req: Request, res: Response, next: NextFunction) {}
}

export const blogController = new BlogController();
