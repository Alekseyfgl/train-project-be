import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { IComment, ICommentModel } from '../../types/comment/output';
import { CommentModel } from '../../models/comment.model';
import { QueryUserRepository } from '../user/query-user.repository';
import { IUser } from '../../types/user/output';
import { commentMapper } from '../../mappers/comment.mapper';

export class QueryCommentRepository {
    static async findById(commentId: string): PromiseNull<ICommentModel> {
        try {
            return CommentModel.findById(commentId);
        } catch (e) {
            console.log('[findById]', e);
            return null;
        }
    }

    static async getCommentByIdWithAuthor(commentId: string): PromiseNull<IComment> {
        const comment: Nullable<ICommentModel> = await this.findById(commentId);
        if (!comment) return null;
        const author: Nullable<IUser> = await QueryUserRepository.findById(comment.userId);
        if (!author) return null;
        return commentMapper(comment, author);
    }
}
