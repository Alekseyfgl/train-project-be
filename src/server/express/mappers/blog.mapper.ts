import { IBlogModel, IBlogModelOut } from '../types/blog/output';

interface IPageBlogMapper {
    totalCount: number;
    pagesCount: number;
    pageSize: number;
    pageNumber: number;
    blogs: IBlogModel[];
}

export const pageBlogMapper = (data: IPageBlogMapper): IBlogModelOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, blogs } = data;
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: blogs,
    };
};
