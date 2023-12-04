import { IBlogModel } from '../../types/blog/output';
import { BlogModel } from '../../models/blog.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';

export class ReadBlogRepository {
    static async findAll(): Promise<IBlogModel[]> {
        try {
            return await BlogModel.find({});
        } catch (e) {
            console.error('[findAll]', e);
            return [];
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
