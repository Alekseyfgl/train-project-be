import { Types } from 'mongoose';

export interface UserSchema extends Document {
    _id: Types.ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface ConfirmationUserSchema extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    isConfirmed: boolean;
}
// export interface IConfirmationUser {
//     id: string;
//     userId: string;
//     isConfirmed: boolean;
// }

export interface IUser {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}
export interface UserWithConfirm extends IUser {
    confirmInfo: {
        id: string;
        isConfirmed: boolean;
    };
}

export interface IUserPaginationOut {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IUser[];
}
