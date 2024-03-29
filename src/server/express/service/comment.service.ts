import dotenv from 'dotenv';
import { AddCommentDto, UpdateCommentDto } from '../types/comment/input';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IComment, ICommentModel } from '../types/comment/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { IUser } from '../types/user/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { commentMapper } from '../mappers/comment.mapper';
import { CommandCommentRepository } from '../repositories/comment/command-comment.repository';
import { QueryCommentRepository } from '../repositories/comment/query-comment.repository';

dotenv.config();

export class CommentService {
    static async create(dto: AddCommentDto, postId: string, userId: string): PromiseNull<IComment> {
        const newComment = { postId, userId, content: dto.content };

        const createdComment: Nullable<ICommentModel> = await CommandCommentRepository.create(newComment);
        if (!createdComment) return null;

        const author: Nullable<IUser> = await QueryUserRepository.findById(userId);
        if (!author) return null;

        return commentMapper(createdComment, author);
    }

    static async update(dto: UpdateCommentDto, commentId: string, userId: string): Promise<HttpStatusCodes> {
        const commentById: Nullable<ICommentModel> = await QueryCommentRepository.findById(commentId);
        if (!commentById) return HttpStatusCodes.NOT_FOUND;

        if (commentById.userId !== userId) return HttpStatusCodes.FORBIDDEN;

        const iscCommentUpdated: boolean = await CommandCommentRepository.updateById(commentId, dto);
        return iscCommentUpdated ? HttpStatusCodes.NO_CONTENT : HttpStatusCodes.NOT_FOUND;
    }

    static async delete(commentId: string, userId: string): Promise<HttpStatusCodes> {
        const commentById: Nullable<ICommentModel> = await QueryCommentRepository.findById(commentId);
        if (!commentById) return HttpStatusCodes.NOT_FOUND;

        if (commentById.userId !== userId) return HttpStatusCodes.FORBIDDEN;

        const iscCommentUpdated: boolean = await CommandCommentRepository.deleteById(commentId);
        return iscCommentUpdated ? HttpStatusCodes.NO_CONTENT : HttpStatusCodes.NOT_FOUND;
    }
}
