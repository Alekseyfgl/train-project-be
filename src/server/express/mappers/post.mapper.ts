import { IPost, IPostModelOut, PostSchema } from '../types/post/output';
import { PostsByBlogQuery, PostsByBlogQueryOptional } from '../types/post/input';

export const postsGetAllQueryMapper = (query: PostsByBlogQueryOptional): PostsByBlogQuery => {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    return {
        pageSize: pageSize ? +pageSize : 10,
        pageNumber: pageNumber ? +pageNumber : 1,
        sortDirection: sortDirection || 'desc',
        sortBy: sortBy || 'createdAt',
    };
};

export const pagePostMapper = (data: { totalCount: number; pagesCount: number; pageSize: number; pageNumber: number; posts: PostSchema[] }): IPostModelOut => {
    const { pageSize, pageNumber, pagesCount, totalCount, posts } = data;
    return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts,
    };
};

export const postMapper = (data: PostSchema): IPost => {
    return {
        id: data._id.toString(),
        blogId: data.blogId.toString(),
        title: data.title,
        content: data.content,
        blogName: data.blogName,
        createdAt: data.createdAt,
        shortDescription: data.shortDescription,
    };
};
