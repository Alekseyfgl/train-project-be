import dotenv from 'dotenv';
import { AddCommentDto } from '../types/comment/input';
import { CommandCommentRepository } from '../repositories/comments/command-comment.repository';
import { commentMapper } from '../mappers/comment.mapper';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IComment, ICommentModel } from '../types/comment/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { IUser } from '../types/user/output';

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
}
