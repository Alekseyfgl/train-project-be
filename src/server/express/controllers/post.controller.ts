import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IPostModelOut, PostSchema } from '../types/post/output';
import { AddPostDto, PostsByBlogQuery, PostsByBlogQueryOptional, UpdatePostDto } from '../types/post/input';
import { QueryPostRepository } from '../repositories/post/query-post.repository';
import { postsGetAllQueryMapper } from '../mappers/post.mapper';
import { AddCommentDto, CommentsByPostQuery, CommentsByPostQueryOptional } from '../types/comment/input';
import { IComment, ICommentPaginationOut } from '../types/comment/output';
import { PostService } from '../service/post.service';
import { CommentService } from '../service/comment.service';
import { getAllCommentsByPostIdQueryMapper } from '../mappers/comment.mapper';
import { QueryCommentRepository } from '../repositories/comments/query-comment.repository';

class PostController {
    async getAll(req: Request<{}, {}, {}, PostsByBlogQueryOptional>, res: Response, next: NextFunction) {
        const query: PostsByBlogQuery = postsGetAllQueryMapper(req.query);
        const posts: IPostModelOut = await QueryPostRepository.getAll(query);

        new ApiResponse(res).send(HttpStatusCodes.OK, posts);
    }

    async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const id = req.params.id;
        const post: Nullable<PostSchema> = await QueryPostRepository.findById(id);

        post ? new ApiResponse(res).send(HttpStatusCodes.OK, post) : new ApiResponse(res).notFound();
    }

    async addByOne(req: Request<{}, {}, AddPostDto>, res: Response, next: NextFunction) {
        const newBlog: Nullable<PostSchema> = await PostService.create(req.body);
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

    async addCommentToPost(req: Request<{ id: string }, {}, AddCommentDto>, res: Response) {
        const postId = req.params.id;
        const userId: Optional<string> = req?.user?.userId;
        if (!userId) return new ApiResponse(res).notAuthorized();

        const result: Nullable<IComment> = await CommentService.create(req.body, postId, userId);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.CREATED, result) : response.notFound();
    }

    async getAllCommentsByPostId(req: Request<{ id: string }, {}, {}, CommentsByPostQueryOptional>, res: Response) {
        const postId = req.params.id;
        const query: CommentsByPostQuery = getAllCommentsByPostIdQueryMapper(req.query);

        const result: Nullable<ICommentPaginationOut> = await QueryCommentRepository.getAllCommentsByPostId(postId, query);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.OK, result) : response.notFound();
    }
}

export const postController = new PostController();
