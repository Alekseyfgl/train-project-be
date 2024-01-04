export interface AddCommentDto {
    content: string;
}

export interface UpdateCommentDto {
    content: string;
}

export interface CommentsByPostQuery {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type CommentsByPostQueryOptional = Partial<CommentsByPostQuery>;
