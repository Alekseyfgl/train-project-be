import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IBlogSchema } from '../types/blog/output';
import { AddBlogDto, UpdateBlogDto } from '../types/blog/input';
import { CommandBlogRepository } from '../repositories/blog/command-blog.repository';
import { AddPostDto, IPostToBlogDto } from '../types/post/input';
import { CommandPostRepository } from '../repositories/post/command-post.repository';
import { PostSchema } from '../types/post/output';
import { QueryBlogRepository } from '../repositories/blog/query-blog.repository';
import { QueryPostRepository } from '../repositories/post/query-post.repository';

export class BlogService {
    static async create(dto: AddBlogDto): PromiseNull<IBlogSchema> {
        return CommandBlogRepository.create(dto);
    }

    static async updateById(id: string, dto: UpdateBlogDto) {
        return CommandBlogRepository.updateById(id, dto);
    }

    static async removeById(id: string) {
        return CommandBlogRepository.removeById(id);
    }

    static async createPostToBlog(blogId: string, postDto: IPostToBlogDto): PromiseNull<PostSchema> {
        const blog: Nullable<IBlogSchema> = await QueryBlogRepository.findById(blogId);
        if (!blog) return null;

        const newPost: AddPostDto = {
            blogId: String(blogId),
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            title: postDto.title,
        };

        const createdPostId: Nullable<string> = await CommandPostRepository.create(newPost);
        if (!createdPostId) return null;
        return QueryPostRepository.findById(createdPostId);
    }
}
