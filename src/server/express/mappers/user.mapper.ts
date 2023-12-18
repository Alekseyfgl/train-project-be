import { IUserModel } from '../models/users.model';
import { IUser, IUserPaginationOut } from '../types/user/output';
import { UserPaginationQuery, UserPaginationQueryOptional } from '../types/user/input';

export const userMapper = (user: IUserModel): IUser => {
    return {
        id: user.id,
        email: user.email,
        login: user.login,
        createdAt: user.createdAt,
    };
};

export const createFilterGetAllUsersMapper = (query: UserPaginationQueryOptional): UserPaginationQuery => {
    return {
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || 'desc',
        searchEmailTerm: query.searchEmailTerm || null,
        searchLoginTerm: query.searchLoginTerm || null,
    };
};

export const pageUsersMapper = (data: { totalCount: number; pagesCount: number; pageSize: number; pageNumber: number; users: IUser[] }): IUserPaginationOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, users } = data;
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: users,
    };
};
