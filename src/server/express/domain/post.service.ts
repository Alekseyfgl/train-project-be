import { AddPostDto, UpdatePostDto } from '../types/post/input';
import { WritePostRepository } from '../repositories/post/write-post.repository';
import { PromiseNull } from '../common/interfaces/optional.types';
import { IPostModel } from '../types/post/output';

export class PostService {
    static async create(dto: AddPostDto): PromiseNull<IPostModel> {
        return WritePostRepository.create(dto);
    }

    static async updateById(id: string, dto: UpdatePostDto) {
        return WritePostRepository.updateById(id, dto);
    }

    static async removeById(id: string) {
        return WritePostRepository.removeById(id);
    }
}
