import { NextFunction, Request, Response } from 'express';
import { BlogRepository } from '../repositories/blog.repository';
import { IBlog } from '../types/blog/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { AddBlogDto, UpdateBlogDto } from '../types/blog/input';

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

    async addBlogByOne(req: Request<{}, {}, AddBlogDto>, res: Response, next: NextFunction) {
        const newBlog: IBlog = new BlogRepository().createNewBlog(req.body);
        new ApiResponse(res).send(HttpStatusCodes.CREATED, newBlog);
    }

    async updateBlogById(req: Request<{ id: string }, {}, UpdateBlogDto>, res: Response, next: NextFunction) {
        const isUpdated: boolean = new BlogRepository().updateBlogById(req.params.id, req.body);
        const response = new ApiResponse(res);
        isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async removeBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const isRemoved: boolean = new BlogRepository().removeBlogById(req.params.id);
        const response = new ApiResponse(res);
        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }
}

export const blogController = new BlogController();
