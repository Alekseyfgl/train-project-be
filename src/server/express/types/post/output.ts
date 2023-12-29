export interface PostSchema extends Document {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export interface IPostModelOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostSchema[];
}
