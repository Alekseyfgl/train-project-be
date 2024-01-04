import { Types } from 'mongoose';

export interface UserSchema extends Document {
    _id: Types.ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface IUser {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export interface IUserPaginationOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IUser[];
}
