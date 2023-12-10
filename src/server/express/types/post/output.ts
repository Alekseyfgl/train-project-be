export interface IPostModel extends Document {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPostModelOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IPostModel[];
}
