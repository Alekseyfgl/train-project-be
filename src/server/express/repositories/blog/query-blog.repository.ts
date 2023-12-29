import { IBlogModelOut, IBlogSchema } from '../../types/blog/output';
import { BlogModel } from '../../models/blog.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { BlogQuery } from '../../types/blog/input';
import { pageBlogMapper } from '../../mappers/blog.mapper';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';

export class QueryBlogRepository {
    static async findAll(query: BlogQuery): PromiseNull<IBlogModelOut> {
        const { pageSize, pageNumber, sortDirection, sortBy, searchNameTerm } = query;

        let filter: { name?: { $regex: RegExp } } = {};
        if (searchNameTerm) {
            filter.name = { $regex: new RegExp(searchNameTerm, 'i') };
        }
        const direction: 1 | -1 = sortDirection === 'desc' ? -1 : 1;

        try {
            const blogs = await BlogModel.find(filter)
                .sort({ [sortBy]: direction })
                .skip(offsetPagination(pageNumber, pageSize))
                .limit(pageSize);

            const totalCount: number = await BlogModel.countDocuments(filter);
            const pagesCount: number = countTotalPages(totalCount, pageSize);
            return pageBlogMapper({ blogs, pagesCount, totalCount, pageSize, pageNumber });
        } catch (e) {
            console.error('[findAll]', e);
            return pageBlogMapper({ blogs: [], pagesCount: 0, totalCount: 0, pageSize, pageNumber });
        }
    }

    static async findById(id: string): PromiseNull<IBlogSchema> {
        try {
            const blog: Nullable<IBlogSchema> = await BlogModel.findById(id);
            return blog;
        } catch (e) {
            console.error('[BLOG,findById]', e);
            return null;
        }
    }
}
