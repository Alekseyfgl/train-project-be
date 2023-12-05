import { IBlogModel, IBlogModelOut } from '../../types/blog/output';
import { BlogModel } from '../../models/blog.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { BlogQueryType } from '../../types/blog/input';
import { pageBlogMapper } from '../../mappers/blog.mapper';

export class ReadBlogRepository {
    static async findAll(query: BlogQueryType): PromiseNull<IBlogModelOut> {
        const sortDirection = query.sortDirection ?? 'desc';
        const sortBy = query.sortBy ?? 'createdAt';
        const pageNumber = query.pageNumber ? +query.pageNumber : 1;
        const pageSize = query.pageSize ? +query.pageSize : 10;
        const searchNameTerm = query.searchNameTerm ?? null;

        let filter = {};
        if (searchNameTerm) {
            // filter = { name: { $regex: searchNameTerm, $options: 'i' } };
            filter = new RegExp(searchNameTerm, 'i');
        }
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const blogs = await BlogModel.find(filter)
                .sort({ sortBy: direction })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount = await BlogModel.countDocuments();
            const pagesCount = Math.ceil(totalCount / pageSize);
            return pageBlogMapper({ blogs, pagesCount, totalCount, pageSize, pageNumber });
        } catch (e) {
            console.error('[findAll]', e);
            return null;
        }
    }

    static async findById(id: string): PromiseNull<IBlogModel> {
        try {
            const blog: Nullable<IBlogModel> = await BlogModel.findById(id);
            return blog;
        } catch (e) {
            console.error('[findById]', e);
            return null;
        }
    }
}
