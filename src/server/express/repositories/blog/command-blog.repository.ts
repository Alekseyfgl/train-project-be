import { AddBlogDto, UpdateBlogDto } from '../../types/blog/input';
import { UpdateWriteOpResult } from 'mongoose';
import { BlogModel } from '../../models/blog.model';
import { DeleteResult } from 'mongodb';
import { PromiseNull } from '../../common/interfaces/optional.types';
import { IBlogSchema } from '../../types/blog/output';

export class CommandBlogRepository {
    static async updateById(id: string, dto: UpdateBlogDto): Promise<boolean> {
        try {
            const result: UpdateWriteOpResult = await BlogModel.updateOne({ _id: id }, dto);
            return !!result.matchedCount;
        } catch (e) {
            console.error('[updateById]', e);
            return false;
        }
    }

    static async removeById(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await BlogModel.deleteOne({ _id: id });
            return !!result.deletedCount;
        } catch (e) {
            console.error('[removeById]', e);
            return false;
        }
    }

    static async create(dto: AddBlogDto): PromiseNull<IBlogSchema> {
        try {
            return await BlogModel.create(dto);
        } catch (err) {
            console.error('[create]', err);
            return null;
        }
    }
}
