import { IBlogModel, IBlogModelOut } from '../types/blog/output';

export const pageBlogMapper = (data: { totalCount: number; pagesCount: number; pageSize: number; pageNumber: number; blogs: IBlogModel[] }): IBlogModelOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, blogs } = data;
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: blogs,
    };
};
