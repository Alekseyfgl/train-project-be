import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { CommentModel } from '../../models/comment.model';
import { ICommentModel } from '../../types/comment/output';
import { UpdateWriteOpResult } from 'mongoose';
import { UpdateCommentDto } from '../../types/comment/input';

export class CommandCommentRepository {
    static async create(newComment: { postId: string; userId: string; content: string }): PromiseNull<ICommentModel> {
        try {
            const createdComment: Nullable<ICommentModel> = await CommentModel.create(newComment);
            return createdComment;
        } catch (e) {
            console.error('[create]', e);
            return null;
        }
    }

    static async updateById(commentId: string, dto: UpdateCommentDto): Promise<boolean> {
        try {
            const result: UpdateWriteOpResult = await CommentModel.updateOne({ _id: commentId }, dto);
            return !!result.matchedCount;
        } catch (e) {
            console.error('[updateById]', e);
            return false;
        }
    }
}
