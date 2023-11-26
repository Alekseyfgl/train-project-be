import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { AddBlogDto } from '../types/blog/input';
import { UpdateWriteOpResult } from 'mongoose';
import { IBlogModel } from '../types/blog/output';
import { BlogModel } from '../models/blog.model';
import { DeleteResult } from 'mongodb';

export class BlogRepository {
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

    static async create(dto: AddBlogDto): PromiseNull<IBlogModel> {
        try {
            return await BlogModel.create(dto);
        } catch (err) {
            console.error('[create]', err);
            return null;
        }
    }

    static async updateById(id: string, dto: AddBlogDto): Promise<boolean> {
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
}
