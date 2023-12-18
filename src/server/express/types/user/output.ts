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
