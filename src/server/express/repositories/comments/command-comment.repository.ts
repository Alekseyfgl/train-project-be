import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { CommentModel } from '../../models/comment.model';
import { CommentSchema, ICommentModel } from '../../types/comment/output';
import { UpdateWriteOpResult } from 'mongoose';
import { UpdateCommentDto } from '../../types/comment/input';
import { clearCommentMapper } from '../../mappers/comment.mapper';
import { DeleteResult } from 'mongodb';

export class CommandCommentRepository {
    static async create(newComment: { postId: string; userId: string; content: string }): PromiseNull<ICommentModel> {
        try {
            const createdComment: Nullable<CommentSchema> = await CommentModel.create(newComment);
            return clearCommentMapper(createdComment);
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

    static async deleteById(commentId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await CommentModel.deleteOne({ _id: commentId });
            return !!result.deletedCount;
        } catch (e) {
            console.error('[deleteById]', e);
            return false;
        }
    }
}
