import { IPostModel, IPostModelOut } from '../../types/post/output';
import { PostModel } from '../../models/post.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { PostsByBlogQuery } from '../../types/blog/input';
import { pagePostMapper } from '../../mappers/post.mapper';
import { QueryBlogRepository } from '../blog/query-blog.repository';
import { IBlogModel } from '../../types/blog/output';

export class QueryPostRepository {
    static async getAll(query: PostsByBlogQuery): Promise<IPostModelOut> {
        console.log(query);
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        const filter: any = sortBy !== 'createdAt' ? { [sortBy]: direction, ['createdAt']: 1 } : { [sortBy]: direction };
        try {
            const posts: IPostModel[] = await PostModel.find({})
                .sort(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount: number = await PostModel.countDocuments();
            const pagesCount: number = Math.ceil(totalCount / pageSize);
            return pagePostMapper({ posts, totalCount, pageNumber, pagesCount, pageSize });
        } catch (e) {
            console.log('[getAll]', e);
            return pagePostMapper({ posts: [], totalCount: 0, pageNumber: 1, pagesCount: 1, pageSize: 10 });
        }
    }

    static async findAllPostsByBlogId(blogId: string, query: PostsByBlogQuery): PromiseNull<IPostModelOut> {
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(blogId);
            if (!blog) return null;
            const posts: IPostModel[] = await PostModel.find({ blogId: blogId })
                .sort({ [sortBy]: direction })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);

            const totalCount: number = await PostModel.countDocuments({ blogId: blogId });
            const pagesCount: number = Math.ceil(totalCount / pageSize);
            return pagePostMapper({ posts, totalCount, pageNumber, pagesCount, pageSize });
        } catch (e) {
            console.log('[getAll]', e);
            return pagePostMapper({ posts: [], totalCount: 0, pageNumber: 1, pagesCount: 1, pageSize: 10 });
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

const x = [
    {
        blogId: '65769ab61437b9d967751aac',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:30.925Z',
        id: '65769ab61437b9d967751aaf',
    },
    {
        blogId: '65769ab71437b9d967751ab2',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:31.719Z',
        id: '65769ab71437b9d967751ab5',
    },
    {
        blogId: '65769ab81437b9d967751ab8',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:32.321Z',
        id: '65769ab81437b9d967751abb',
    },
    {
        blogId: '65769ab81437b9d967751abe',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:32.917Z',
        id: '65769ab81437b9d967751ac1',
    },
    {
        blogId: '65769ab91437b9d967751ac4',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:33.536Z',
        id: '65769ab91437b9d967751ac7',
    },
    {
        blogId: '65769ab91437b9d967751aca',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:34.151Z',
        id: '65769aba1437b9d967751acd',
    },
    {
        blogId: '65769aba1437b9d967751ad0',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:34.760Z',
        id: '65769aba1437b9d967751ad3',
    },
    {
        blogId: '65769abb1437b9d967751ad6',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:35.399Z',
        id: '65769abb1437b9d967751ad9',
    },
    {
        blogId: '65769abb1437b9d967751adc',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:36.054Z',
        id: '65769abc1437b9d967751adf',
    },
];
