import { IBlogModel, IBlogModelOut } from '../../types/blog/output';
import { BlogModel } from '../../models/blog.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { BlogQueryTypeOptional } from '../../types/blog/input';
import { pageBlogMapper } from '../../mappers/blog.mapper';

export class QueryBlogRepository {
    static async findAll(query: BlogQueryTypeOptional): PromiseNull<IBlogModelOut> {
        const sortDirection = query.sortDirection ?? 'desc';
        const sortBy = query.sortBy ?? 'createdAt';
        const pageNumber = query.pageNumber ? +query.pageNumber : 1;
        const pageSize = query.pageSize ? +query.pageSize : 10;
        const searchNameTerm = query.searchNameTerm ?? null;

        let filter: { name?: { $regex: RegExp } } = {};
        if (searchNameTerm) {
            filter.name = { $regex: new RegExp(searchNameTerm, 'i') };
        }
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const blogs = await BlogModel.find(filter)
                .sort({ [sortBy]: direction })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount = await BlogModel.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return pageBlogMapper({ blogs, pagesCount, totalCount, pageSize, pageNumber });
        } catch (e) {
            console.error('[findAll]', e);
            return pageBlogMapper({ blogs: [], pagesCount: 0, totalCount: 0, pageSize, pageNumber });
        }
    }

    static async findById(id: string): PromiseNull<IBlogModel> {
        try {
            const blog: Nullable<IBlogModel> = await BlogModel.findById(id);
            return blog;
        } catch (e) {
            console.error('[BLOG,findById]', e);
            return null;
        }
    }
}
