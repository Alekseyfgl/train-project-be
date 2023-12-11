export interface AddPostDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export interface UpdatePostDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export interface IPostToBlogDto {
    title: string;
    shortDescription: string;
    content: string;
}

export interface PostsByBlogQuery {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type PostsByBlogQueryOptional = Partial<PostsByBlogQuery>;
