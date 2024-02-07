import { AddPostDto, UpdatePostDto } from '../types/post/input';
import { CommandPostRepository } from '../repositories/post/command-post.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { PostSchema } from '../types/post/output';
import { QueryPostRepository } from '../repositories/post/query-post.repository';

export class PostService {
    static async create(dto: AddPostDto): PromiseNull<PostSchema> {
        const createdPostId: Nullable<string> = await CommandPostRepository.create(dto);
        if (!createdPostId) return null;
        return QueryPostRepository.findById(createdPostId);
    }

    static updateById(id: string, dto: UpdatePostDto) {
        return CommandPostRepository.updateById(id, dto);
    }

    static removeById(id: string) {
        return CommandPostRepository.removeById(id);
    }
}
