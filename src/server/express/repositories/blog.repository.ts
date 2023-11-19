import { db } from '../../db/db';
import { Nullable } from '../common/interfaces/optional.types';
import { IBlog } from '../types/blog/output';

export class BlogRepository {
    static getAllBlogs(): IBlog[] {
        return db.blogs;
    }

    static findBlockById(id: string): Nullable<IBlog> {
        const blog = db.blogs.find((blog) => blog.id === id);
        return blog ? blog : null;
    }
}
