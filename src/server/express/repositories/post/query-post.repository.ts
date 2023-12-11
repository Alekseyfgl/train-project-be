import { IPostModel, IPostModelOut } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { PostsByBlogQuery } from '../../types/blog/input';
import { pagePostMapper } from '../../mappers/post.mapper';
import { QueryBlogRepository } from '../blog/query-blog.repository';
import { IBlogModel } from '../../types/blog/output';

export class QueryPostRepository {
    static async getAll(query: PostsByBlogQuery): Promise<IPostModelOut> {
        console.log(query);
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const posts: IPostModel[] = await PostModel.find({})
                .sort({ [sortBy]: direction })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount: number = await PostModel.countDocuments();
            const pagesCount: number = Math.ceil(totalCount / pageSize);
            return pagePostMapper({ posts, totalCount, pageNumber, pagesCount, pageSize });
        } catch (e) {
            console.log('[getAll]', e);
            return pagePostMapper({ posts: [], totalCount: 0, pageNumber: 1, pagesCount: 1, pageSize: 10 });
        }
    }

    static async findAllPostsByBlogId(blogId: string, query: PostsByBlogQuery): PromiseNull<IPostModelOut> {
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(blogId);
            if (!blog) return null;
            const posts: IPostModel[] = await PostModel.find({ blogId: blogId })
                .sort({ [sortBy]: direction })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount: number = await PostModel.countDocuments({ blogId: blogId });
            const pagesCount: number = Math.ceil(totalCount / pageSize);
            return pagePostMapper({ posts, totalCount, pageNumber, pagesCount, pageSize });
        } catch (e) {
            console.log('[getAll]', e);
            return pagePostMapper({ posts: [], totalCount: 0, pageNumber: 1, pagesCount: 1, pageSize: 10 });
        }
    }

    static async findById(id: string): PromiseNull<IPostModel> {
        try {
            return await PostModel.findById(id);
        } catch (e) {
            console.log('[findById]', e);
            return null;
        }
    }
}
