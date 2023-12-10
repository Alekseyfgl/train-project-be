import { NextFunction, Request, Response } from 'express';
import { IBlogModel, IBlogModelOut } from '../types/blog/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { AddBlogDto, BlogQueryTypeOptional, PostsByBlogQuery, PostsByBlogQueryOptional, UpdateBlogDto } from '../types/blog/input';
import { BlogService } from '../domain/blog.service';
import { QueryBlogRepository } from '../repositories/blog/query-blog.repository';
import { IPostToBlogDto } from '../types/post/input';
import { IPostModel, IPostModelOut } from '../types/post/output';
import { postsByBlogQueryMapper } from '../mappers/post.mapper';
import { QueryPostRepository } from '../repositories/post/query-post.repository';

class BlogController {
    async getAllBlogs(req: Request<{}, {}, {}, BlogQueryTypeOptional>, res: Response, next: NextFunction) {
        const sortData = {
            searchNameTerm: req.query.searchNameTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        };

        const blogs: Optional<IBlogModelOut> = await QueryBlogRepository.findAll(sortData);

        new ApiResponse(res).send(HttpStatusCodes.OK, blogs);
    }

    async getBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        console.log('!!!!===>getBlogById');
        const id = req.params.id;
        const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(id);

        blog ? new ApiResponse(res).send(HttpStatusCodes.OK, blog) : new ApiResponse(res).notFound();
    }

    async addBlogByOne(req: Request<{}, {}, AddBlogDto>, res: Response, next: NextFunction) {
        console.log('!!!!===>addBlogByOne');
        const newBlog: Nullable<IBlogModel> = await BlogService.create(req.body);
        new ApiResponse(res).send(HttpStatusCodes.CREATED, newBlog);
    }

    async updateBlogById(req: Request<{ id: string }, {}, UpdateBlogDto>, res: Response, next: NextFunction) {
        console.log('!!!!===>updateBlogById');
        const isUpdated: boolean = await BlogService.updateById(req.params.id, req.body);
        const response = new ApiResponse(res);
        isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async removeBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        console.log('!!!!===>removeBlogById');
        const isRemoved: boolean = await BlogService.removeById(req.params.id);
        const response = new ApiResponse(res);
        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async createPostToBlog(req: Request<{ id: string }, {}, IPostToBlogDto>, res: Response, next: NextFunction) {
        const id = req.params.id;
        console.log('!!!!===>createPostToBlog');
        const createdPost: Nullable<IPostModel> = await BlogService.createPostToBlog(id, req.body);
        const response = new ApiResponse(res);
        createdPost ? response.send(HttpStatusCodes.CREATED, createdPost) : response.notFound();
    }

    async getAllPostsByBlogId(req: Request<{ id: string }, {}, {}, PostsByBlogQueryOptional>, res: Response) {
        console.log('!!!!===>getAllPostsByBlogId');
        const blogId = req.params.id;
        const query: PostsByBlogQuery = postsByBlogQueryMapper(req.query);

        const blogWithPosts: Nullable<IPostModelOut> = await QueryPostRepository.findAllPostsByBlogId(blogId, query);

        const response = new ApiResponse(res);
        blogWithPosts ? response.send(HttpStatusCodes.OK, blogWithPosts) : response.notFound();
    }
}

export const blogController = new BlogController();
