import { Nullable } from '../../common/interfaces/optional.types';

export interface AddUserDto {
    login: string;
    password: string;
    email: string;
}

export interface UserPaginationQuery {
    searchLoginTerm: Nullable<string>;
    searchEmailTerm: Nullable<string>;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
export type UserPaginationQueryOptional = Partial<UserPaginationQuery>;
