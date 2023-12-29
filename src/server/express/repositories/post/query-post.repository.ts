import { IPostModelOut, PostSchema } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { pagePostMapper } from '../../mappers/post.mapper';
import { QueryBlogRepository } from '../blog/query-blog.repository';
import { IBlogSchema } from '../../types/blog/output';
import { PostsByBlogQuery } from '../../types/post/input';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';

export class QueryPostRepository {
    static async getAll(query: PostsByBlogQuery): Promise<IPostModelOut> {
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        const filter: any =
            sortBy !== 'createdAt'
                ? {
                      [sortBy]: direction,
                      ['createdAt']: 1,
                  }
                : { [sortBy]: direction };
        try {
            const posts: PostSchema[] = await PostModel.find({}).sort(filter).skip(offsetPagination(pageNumber, pageSize)).limit(pageSize);

            const totalCount: number = await PostModel.countDocuments();
            const pagesCount: number = countTotalPages(totalCount, pageSize);
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
            const blog: Nullable<IBlogSchema> = await QueryBlogRepository.findById(blogId);
            if (!blog) return null;
            const posts: PostSchema[] = await PostModel.find({ blogId: blogId })
                .sort({ [sortBy]: direction })
                .skip(offsetPagination(pageNumber, pageSize))
                .limit(pageSize);

            const totalCount: number = await PostModel.countDocuments({ blogId: blogId });
            const pagesCount: number = countTotalPages(totalCount, pageSize);
            return pagePostMapper({ posts, totalCount, pageNumber, pagesCount, pageSize });
        } catch (e) {
            console.log('[getAll]', e);
            return pagePostMapper({ posts: [], totalCount: 0, pageNumber: 1, pagesCount: 1, pageSize: 10 });
        }
    }

    static async findById(id: string): PromiseNull<PostSchema> {
        try {
            return await PostModel.findById(id);
        } catch (e) {
            console.log('[findById]', e);
            return null;
        }
    }

    static async getPostWithComments(postId: string) {
        const post: Nullable<PostSchema> = await this.findById(postId);
    }
}
