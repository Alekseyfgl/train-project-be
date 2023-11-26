import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IPostModel } from '../../../../../src/server/express/types/post/output';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { IBlogModel } from '../../../../../src/server/express/types/blog/output';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { updatePostMock } from '../../mock/updatePost/updatePost.mock';
import { mockNotExistMongoId } from '../../../../common/notExistMongoId/notExistMongoId';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base } = postPath;
describe(`${base}`, () => {
    let newBlog: Nullable<IBlogModel> = null; // first create blog
    let newPost: Nullable<IPostModel> = null;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await clearMongoCollections();
        newBlog = (await createBlogMock(addMockBlogDto_valid)).body;
    });

    afterEach(async () => {
        await clearMongoCollections();
    });

    it('+ update post with correct data', async () => {
        const post = await createPostMock(newBlog!.id);
        expect(post.status).toBe(HttpStatusCodes.CREATED);
        newPost = post.body;

        {
            const { status } = await updatePostMock(newPost!.id, {
                blogId: newBlog!.id,
                title: 'Hello world',
                content: 'Hello world',
                shortDescription: 'Hello world',
            });

            expect(status).toBe(HttpStatusCodes.NO_CONTENT);
        }
    });

    it('- update not existing blog', async () => {
        const { status } = await updatePostMock(mockNotExistMongoId, {
            blogId: newBlog!.id,
            title: 'Hello world',
            content: 'Hello world',
            shortDescription: 'Hello world',
        });

        expect(status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it('- update with incorrect title', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                title: '',
                content: 'Hello world',
                shortDescription: 'Hello world',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });
    //
    it('- update without title', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                content: 'Hello world',
                shortDescription: 'Hello world',
            } as any);
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with incorrect content', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                title: 'title',
                content: '',
                shortDescription: 'Hello world',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });
    //
    it('- update without content', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                title: 'title',
                shortDescription: 'Hello world',
            } as any);
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update with incorrect shortDescription', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
                shortDescription: '',
            });
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });
    //
    it('- update without shortDescription', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(`${body!.id}`, {
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
            } as any);
            expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
        }
    });

    it('- update not exist post', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(mockNotExistMongoId, {
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
                shortDescription: 'shortDescription',
            });
            expect(status).toBe(HttpStatusCodes.NOT_FOUND);
        }
    });

    it('- update post for not authorized user', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        {
            const { status } = await updatePostMock(mockNotExistMongoId, {
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
                shortDescription: 'shortDescription',
            });
            expect(status).toBe(HttpStatusCodes.NOT_FOUND);
        }
    });
});
