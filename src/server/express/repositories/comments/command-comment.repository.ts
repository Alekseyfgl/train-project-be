import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { CommentModel } from '../../models/comment.model';
import { ICommentModel } from '../../types/comment/output';

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
}
