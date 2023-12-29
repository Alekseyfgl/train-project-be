export interface ICommentModel extends Document {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
}

export interface IComment {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
}

export interface ICommentPaginationOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IComment[];
}
