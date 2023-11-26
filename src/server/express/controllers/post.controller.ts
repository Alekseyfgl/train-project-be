import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable } from '../common/interfaces/optional.types';
import { IPostModel } from '../types/post/output';
import { PostRepository } from '../repositories/post.repository';
import { AddPostDto, UpdatePostDto } from '../types/post/input';

class PostController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        const posts: IPostModel[] = await PostRepository.getAll();
        new ApiResponse(res).send(HttpStatusCodes.OK, posts);
    }

    async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const post: Nullable<IPostModel> = await PostRepository.findById(id);

        post ? new ApiResponse(res).send(HttpStatusCodes.OK, post) : new ApiResponse(res).notFound();
    }

    async addByOne(req: Request<{}, {}, AddPostDto>, res: Response, next: NextFunction) {
        const newBlog: Nullable<IPostModel> = await PostRepository.create(req.body);
        const response = new ApiResponse(res);
        newBlog ? response.send(HttpStatusCodes.CREATED, newBlog) : response.serverError();
    }

    async updateById(req: Request<{ id: string }, {}, UpdatePostDto>, res: Response, next: NextFunction) {
        const isUpdated: boolean = await PostRepository.updateById(req.params.id, req.body);
        const response = new ApiResponse(res);
        isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async removeById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const isRemoved: boolean = await PostRepository.removeById(req.params.id);
        const response = new ApiResponse(res);
        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }
}

export const postController = new PostController();
