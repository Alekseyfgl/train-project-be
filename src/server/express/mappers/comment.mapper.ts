import { CommentSchema, IComment, ICommentModel, ICommentPaginationOut, ICommentWithAuthorDB } from '../types/comment/output';
import { IUser } from '../types/user/output';
import { CommentsByPostQuery, CommentsByPostQueryOptional } from '../types/comment/input';

export const clearCommentMapper = (comment: CommentSchema): ICommentModel => {
    return {
        id: comment._id.toString(),
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

export const getAllCommentsByPostIdQueryMapper = (query: CommentsByPostQueryOptional): CommentsByPostQuery => {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    return {
        pageSize: pageSize ? +pageSize : 10,
        pageNumber: pageNumber ? +pageNumber : 1,
        sortDirection: sortDirection || 'desc',
        sortBy: sortBy || 'createdAt',
    };
};

export const getAllCommentByIdPagination = (data: { totalCount: number; pagesCount: number; pageSize: number; pageNumber: number; items: ICommentWithAuthorDB[] }): ICommentPaginationOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, items } = data;
    console.log('data!!!!', data);
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: items.map((comment: ICommentWithAuthorDB) => {
            return {
                id: comment._id.toString(),
                content: comment.content,
                createdAt: comment.createdAt,
                commentatorInfo: {
                    userId: comment.user._id.toString(),
                    userLogin: comment.user.login,
                },
            };
        }),
    };
};
