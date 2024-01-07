import { Types } from 'mongoose';

export interface PostSchema extends Document {
    _id: Types.ObjectId;
    blogId: Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogName: string;
    createdAt: string;
}

export interface IPost {
    id: string;
    blogId: string;
    title: string;
    shortDescription: string;
    content: string;
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
