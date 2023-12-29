import { CommentSchema, IComment, ICommentModel } from '../types/comment/output';
import { IUser } from '../types/user/output';

export const clearCommentMapper = (comment: CommentSchema): ICommentModel => {
    return {
        id: comment.id,
        userId: comment.userId.toString(),
        postId: comment.postId.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
    };
};

export const commentMapper = (comment: ICommentModel, user: IUser): IComment => {
    return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: user.id,
            userLogin: user.login,
        },
        createdAt: comment.createdAt,
    };
};
