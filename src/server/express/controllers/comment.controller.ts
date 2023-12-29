import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { QueryCommentRepository } from '../repositories/comments/query-comment.repository';
import { IComment } from '../types/comment/output';

class CommentController {
    async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const commentId = req.params.id;
        const userId: Optional<string> = req?.user?.userId;
        if (!userId) return new ApiResponse(res).notAuthorized();

        const commentWithAuthor: Nullable<IComment> = await QueryCommentRepository.getCommentByIdWithAuthor(commentId);

        const response = new ApiResponse(res);
        commentWithAuthor ? response.send(HttpStatusCodes.OK, commentWithAuthor) : new ApiResponse(res).notFound();
    }
}

export const commentController = new CommentController();
