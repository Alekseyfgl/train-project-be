import { AddPostDto, UpdatePostDto } from '../types/post/input';
import { CommandPostRepository } from '../repositories/post/command-post.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IPostModel } from '../types/post/output';
import { QueryPostRepository } from '../repositories/post/query-post.repository';

export class PostService {
    static async create(dto: AddPostDto): PromiseNull<IPostModel> {
        const createdPostId: Nullable<string> = await CommandPostRepository.create(dto);
        if (!createdPostId) return null;
        return QueryPostRepository.findById(createdPostId);
    }

    static async updateById(id: string, dto: UpdatePostDto) {
        return CommandPostRepository.updateById(id, dto);
    }

    static async removeById(id: string) {
        return CommandPostRepository.removeById(id);
    }
}
