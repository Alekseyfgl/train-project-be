import { PromiseNull } from '../common/interfaces/optional.types';
import { IBlogModel } from '../types/blog/output';
import { AddBlogDto, UpdateBlogDto } from '../types/blog/input';
import { WriteBlogRepository } from '../repositories/blog/write-blog.repository';

export class BlogService {
    static async create(dto: AddBlogDto): PromiseNull<IBlogModel> {
        return WriteBlogRepository.create(dto);
    }

    static async updateById(id: string, dto: UpdateBlogDto) {
        return WriteBlogRepository.updateById(id, dto);
    }

    static async removeById(id: string) {
        return WriteBlogRepository.removeById(id);
    }
}
