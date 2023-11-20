import { AddPostDto, UpdatePostDto } from '../types/post/input';
import { db } from '../../db/db';
import { IPost } from '../types/post/output';
import { Nullable, Optional } from '../common/interfaces/optional.types';

export class PostRepository {
    static getAll() {
        return db.posts;
    }

    static findById(id: string): Nullable<IPost> {
        const post = db.posts.find((post) => post.id === id);
        return post ? post : null;
    }

    addPost(dto: AddPostDto): IPost {
        const post: IPost = {
            id: (+new Date()).toString(),
            blogId: dto.blogId,
            title: dto.title,
            content: dto.content,
            shortDescription: dto.shortDescription,
            blogName: 'blogName',
        };
        db.posts.push(post);
        return post;
    }

    updateById(id: string, dto: UpdatePostDto): boolean {
        const { title, blogId, content, shortDescription } = dto;
        const post: Optional<IPost> = db.posts.find((post) => post.id === id);
        if (!post) return false;

        post.blogId = blogId;
        post.title = title;
        post.content = content;
        post.shortDescription = shortDescription;
        return true;
    }

    removeById(id: string): boolean {
        const index = db.posts.findIndex((post) => post.id === id);
        if (index === -1) return false;
        db.posts.splice(index, 1);
        return true;
    }
}
