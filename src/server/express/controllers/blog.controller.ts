import { NextFunction, Request, Response } from 'express';
import { IBlogModelOut, IBlogSchema } from '../types/blog/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { AddBlogDto, BlogQuery, BlogQueryTypeOptional, UpdateBlogDto } from '../types/blog/input';
import { BlogService } from '../domain/blog.service';
import { QueryBlogRepository } from '../repositories/blog/query-blog.repository';
import { IPostToBlogDto, PostsByBlogQuery, PostsByBlogQueryOptional } from '../types/post/input';
import { IPostModelOut, PostSchema } from '../types/post/output';
import { postsGetAllQueryMapper } from '../mappers/post.mapper';
import { QueryPostRepository } from '../repositories/post/query-post.repository';
import { blogGetAllQueryMapper } from '../mappers/blog.mapper';

class BlogController {
    async getAllBlogs(req: Request<{}, {}, {}, BlogQueryTypeOptional>, res: Response, next: NextFunction) {
        const query: BlogQuery = blogGetAllQueryMapper(req.query);
        const blogs: Optional<IBlogModelOut> = await QueryBlogRepository.findAll(query);

        new ApiResponse(res).send(HttpStatusCodes.OK, blogs);
    }

    async getBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const blog: Nullable<IBlogSchema> = await QueryBlogRepository.findById(id);

        blog ? new ApiResponse(res).send(HttpStatusCodes.OK, blog) : new ApiResponse(res).notFound();
    }

    async addBlogByOne(req: Request<{}, {}, AddBlogDto>, res: Response, next: NextFunction) {
        const newBlog: Nullable<IBlogSchema> = await BlogService.create(req.body);
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

    async createPostToBlog(req: Request<{ id: string }, {}, IPostToBlogDto>, res: Response, next: NextFunction) {
        const id = req.params.id;

        const createdPost: Nullable<PostSchema> = await BlogService.createPostToBlog(id, req.body);
        const response = new ApiResponse(res);
        createdPost ? response.send(HttpStatusCodes.CREATED, createdPost) : response.notFound();
    }

    async getAllPostsByBlogId(req: Request<{ id: string }, {}, {}, PostsByBlogQueryOptional>, res: Response) {
        const blogId = req.params.id;
        const query: PostsByBlogQuery = postsGetAllQueryMapper(req.query);

        const blogWithPosts: Nullable<IPostModelOut> = await QueryPostRepository.findAllPostsByBlogId(blogId, query);

        const response = new ApiResponse(res);
        blogWithPosts ? response.send(HttpStatusCodes.OK, blogWithPosts) : response.notFound();
    }
}

export const blogController = new BlogController();
