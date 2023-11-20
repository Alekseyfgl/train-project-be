import { db } from '../../db/db';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IBlog } from '../types/blog/output';
import { AddBlogDto } from '../types/blog/input';

export class BlogRepository {
    static getAllBlogs(): IBlog[] {
        return db.blogs;
    }

    static findBlockById(id: string): Nullable<IBlog> {
        const blog = db.blogs.find((blog) => blog.id === id);
        return blog ? blog : null;
    }

    createNewBlog(dto: AddBlogDto): IBlog {
        const newBlog: IBlog = {
            id: (+new Date()).toString(),
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        };
        db.blogs.push(newBlog);
        return newBlog;
    }

    updateBlogById(id: string, dto: AddBlogDto): boolean {
        const { name, description, websiteUrl } = dto;
        const blog: Optional<IBlog> = db.blogs.find((blog) => blog.id === id);
        if (!blog) return false;

        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;

        return true;
    }

    removeBlogById(id: string) {
        const index = db.blogs.findIndex((blog) => blog.id === id);
        if (index === -1) return false;
        db.blogs.splice(index, 1);
        return true;
    }
}
