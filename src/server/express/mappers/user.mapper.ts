import { IUser, IUserPaginationOut, UserSchema } from '../types/user/output';
import { UserPaginationQuery, UserPaginationQueryOptional } from '../types/user/input';

export const userMapper = (user: UserSchema): IUser => {
    return {
        id: user.id,
        email: user.email,
        login: user.login,
        createdAt: user.createdAt,
    };
};

export const createFilterGetAllUsersMapper = (query: UserPaginationQueryOptional): UserPaginationQuery => {
    return {
        pageSize: query.pageSize ? +query.pageSize : 10,
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
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
        items: users.map((user) => ({ id: user.id, email: user.email, login: user.login, createdAt: user.createdAt })),
    };
};
