import { IPostModel, IPostModelOut } from '../types/post/output';
import { PostsByBlogQuery, PostsByBlogQueryOptional } from '../types/blog/input';

export const postsByBlogQueryMapper = (query: PostsByBlogQueryOptional): PostsByBlogQuery => {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    return {
        pageSize: pageSize ? +pageSize : 10,
        pageNumber: pageNumber ? +pageNumber : 1,
        sortDirection: sortDirection || 'desc',
        sortBy: sortBy || 'createdAt',
    };
};

export const pagePostMapper = (data: { totalCount: number; pagesCount: number; pageSize: number; pageNumber: number; posts: IPostModel[] }): IPostModelOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, posts } = data;
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts,
    };
};
