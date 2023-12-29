import { IComment, ICommentModel } from '../types/comment/output';
import { IUser } from '../types/user/output';

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
