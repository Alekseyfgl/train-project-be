import { NextFunction, Request, Response } from 'express';
import { IBlogModel } from '../types/blog/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { AddBlogDto, UpdateBlogDto } from '../types/blog/input';
import { BlogService } from '../domain/blog.service';
import { ReadBlogRepository } from '../repositories/blog/read-blog.repository';

class BlogController {
    async getAllBlogs(req: Request, res: Response, next: NextFunction) {
        const blogs = await ReadBlogRepository.findAll();

        new ApiResponse(res).send(HttpStatusCodes.OK, blogs);
    }

    async getBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const blog: Nullable<IBlogModel> = await ReadBlogRepository.findById(id);

        blog ? new ApiResponse(res).send(HttpStatusCodes.OK, blog) : new ApiResponse(res).notFound();
    }

    async addBlogByOne(req: Request<{}, {}, AddBlogDto>, res: Response, next: NextFunction) {
        const newBlog: Nullable<IBlogModel> = await BlogService.create(req.body);
        new ApiResponse(res).send(HttpStatusCodes.CREATED, newBlog);
    }

    async updateBlogById(req: Request<{ id: string }, {}, UpdateBlogDto>, res: Response, next: NextFunction) {
        const isUpdated: boolean = await BlogService.updateById(req.params.id, req.body);
        const response = new ApiResponse(res);
        isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async removeBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const isRemoved: boolean = await BlogService.removeById(req.params.id);
        const response = new ApiResponse(res);
        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }
}

export const blogController = new BlogController();
