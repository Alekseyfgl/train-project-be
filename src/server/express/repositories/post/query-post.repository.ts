import { IPostModel } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { PromiseNull } from '../../common/interfaces/optional.types';

export class QueryPostRepository {
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
}
