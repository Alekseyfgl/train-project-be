import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable } from '../common/interfaces/optional.types';
import { IPostModel, IPostModelOut } from '../types/post/output';
import { AddPostDto, PostsByBlogQuery, PostsByBlogQueryOptional, UpdatePostDto } from '../types/post/input';
import { QueryPostRepository } from '../repositories/post/query-post.repository';
import { PostService } from '../domain/post.service';
import { postsGetAllQueryMapper } from '../mappers/post.mapper';

class PostController {
    async getAll(req: Request<{}, {}, {}, PostsByBlogQueryOptional>, res: Response, next: NextFunction) {
        const query: PostsByBlogQuery = postsGetAllQueryMapper(req.query);
        const posts: IPostModelOut = await QueryPostRepository.getAll(query);

        new ApiResponse(res).send(HttpStatusCodes.OK, posts);
    }

    async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const post: Nullable<IPostModel> = await QueryPostRepository.findById(id);

        post ? new ApiResponse(res).send(HttpStatusCodes.OK, post) : new ApiResponse(res).notFound();
    }

    async addByOne(req: Request<{}, {}, AddPostDto>, res: Response, next: NextFunction) {
        const newBlog: Nullable<IPostModel> = await PostService.create(req.body);
        const response = new ApiResponse(res);
        newBlog ? response.send(HttpStatusCodes.CREATED, newBlog) : response.serverError();
    }

    async updateById(req: Request<{ id: string }, {}, UpdatePostDto>, res: Response, next: NextFunction) {
        const isUpdated: boolean = await PostService.updateById(req.params.id, req.body);
        const response = new ApiResponse(res);
        isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async removeById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const isRemoved: boolean = await PostService.removeById(req.params.id);
        const response = new ApiResponse(res);
        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }
}

export const postController = new PostController();
