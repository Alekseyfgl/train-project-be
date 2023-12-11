import { IBlogModel, IBlogModelOut } from '../types/blog/output';
import { BlogQuery, BlogQueryTypeOptional } from '../types/blog/input';

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

export const blogGetAllQueryMapper = (query: BlogQueryTypeOptional): BlogQuery => {
    const { pageSize, pageNumber, sortDirection, sortBy, searchNameTerm } = query;
    return {
        pageSize: pageSize ? +pageSize : 10,
        pageNumber: pageNumber ? +pageNumber : 1,
        sortDirection: sortDirection || 'desc',
        sortBy: sortBy || 'createdAt',
        searchNameTerm: searchNameTerm || null,
    };
};
