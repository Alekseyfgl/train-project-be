import { AddPostDto, UpdatePostDto } from '../../types/post/input';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { PostSchema } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { UpdateWriteOpResult } from 'mongoose';

export class CommandPostRepository {
    static async create(dto: AddPostDto): PromiseNull<string> {
        try {
            const createdPost: Nullable<PostSchema> = await PostModel.create(dto);
            return createdPost.id;
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
            const result = await PostModel.findOneAndDelete({ _id: id });
            return !!result;
        } catch (e) {
            console.error('[removeById]', e);
            return false;
        }
    }
}
