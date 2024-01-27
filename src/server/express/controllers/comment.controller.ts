import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IComment } from '../types/comment/output';
import { ErrorCreator } from '../common/errors/error-creator/error-creator';
import { HttpExceptionMessages } from '../common/constans/http-exception-messages';
import { CommentService } from '../service/comment.service';
import { QueryCommentRepository } from '../repositories/comment/query-comment.repository';

class CommentController {
    async getById(req: Request<{ id: string }>, res: Response) {
        const commentId = req.params.id;

        const commentWithAuthor: Nullable<IComment> = await QueryCommentRepository.getCommentByIdWithAuthor(commentId);

        const response = new ApiResponse(res);
        commentWithAuthor ? response.send(HttpStatusCodes.OK, commentWithAuthor) : new ApiResponse(res).notFound();
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const commentId = req.params.id;
        const userId: Optional<string> = req?.user?.userId;
        if (!userId) return new ApiResponse(res).notAuthorized();

        const result: HttpStatusCodes = await CommentService.update(req.body, commentId, userId);
        const response = new ApiResponse(res);

        switch (result) {
            case HttpStatusCodes.NO_CONTENT:
                return response.send(HttpStatusCodes.NO_CONTENT);
            case HttpStatusCodes.FORBIDDEN:
                return response.send(HttpStatusCodes.FORBIDDEN, new ErrorCreator().add(HttpExceptionMessages.FORBIDDEN, 'content'));
            case HttpStatusCodes.NOT_FOUND:
                return response.notFound();
            default:
                return response.notFound();
        }
    }
    async delete(req: Request<{ id: string }>, res: Response) {
        const commentId = req.params.id;
        const userId: Optional<string> = req?.user?.userId;
        if (!userId) return new ApiResponse(res).notAuthorized();

        const result: HttpStatusCodes = await CommentService.delete(commentId, userId);
        const response = new ApiResponse(res);

        switch (result) {
            case HttpStatusCodes.NO_CONTENT:
                return response.send(HttpStatusCodes.NO_CONTENT);
            case HttpStatusCodes.FORBIDDEN:
                return response.send(HttpStatusCodes.FORBIDDEN, new ErrorCreator().add(HttpExceptionMessages.FORBIDDEN, 'content'));
            case HttpStatusCodes.NOT_FOUND:
                return response.notFound();
            default:
                return response.notFound();
        }
    }
}

export const commentController = new CommentController();
