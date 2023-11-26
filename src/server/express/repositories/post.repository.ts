import { AddPostDto, UpdatePostDto } from '../types/post/input';
import { IPostModel } from '../types/post/output';
import { PromiseNull } from '../common/interfaces/optional.types';
import { PostModel } from '../models/post.model';
import { DeleteResult } from 'mongodb';
import { UpdateWriteOpResult } from 'mongoose';

export class PostRepository {
    static async getAll(): Promise<IPostModel[]> {
        try {
            return await PostModel.find({});
        } catch (e) {
            console.log('[getAll]', e);
            return [];
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

    static async create(dto: AddPostDto): PromiseNull<IPostModel> {
        try {
            return await PostModel.create(dto);
        } catch (e) {
            console.error('[addPost]', e);
            return null;
        }
    }

    static async updateById(id: string, dto: UpdatePostDto): Promise<boolean> {
        try {
            const result: UpdateWriteOpResult = await PostModel.updateOne({ _id: id }, dto);
            return !!result.matchedCount;
        } catch (e) {
            console.error('[updateById]', e);
            return false;
        }
    }

    static async removeById(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await PostModel.deleteOne({ _id: id });
            return !!result.deletedCount;
        } catch (e) {
            console.error('[removeById]', e);
            return false;
        }
    }
}
