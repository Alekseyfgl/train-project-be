import { AddPostDto, UpdatePostDto } from '../../types/post/input';
import { PromiseNull } from '../../common/interfaces/optional.types';
import { IPostModel } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { UpdateWriteOpResult } from 'mongoose';
import { DeleteResult } from 'mongodb';

export class WritePostRepository {
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
