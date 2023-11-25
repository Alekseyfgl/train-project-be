import { mongo } from '../../db/mongo';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IBlog } from '../types/blog/output';
import { AddBlogDto } from '../types/blog/input';

export class BlogRepository {
    static getAllBlogs(): IBlog[] {
        return mongo.blogs;
    }

    static findBlockById(id: string): Nullable<IBlog> {
        const blog = mongo.blogs.find((blog) => blog.id === id);
        return blog ? blog : null;
    }

    createNewBlog(dto: AddBlogDto): IBlog {
        const newBlog: IBlog = {
            id: (+new Date()).toString(),
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        };
        mongo.blogs.push(newBlog);
        return newBlog;
    }

    updateBlogById(id: string, dto: AddBlogDto): boolean {
        const { name, description, websiteUrl } = dto;
        const blog: Optional<IBlog> = mongo.blogs.find((blog) => blog.id === id);
        if (!blog) return false;

        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;

        return true;
    }

    removeBlogById(id: string) {
        const index = mongo.blogs.findIndex((blog) => blog.id === id);
        if (index === -1) return false;
        mongo.blogs.splice(index, 1);
        return true;
    }
}
