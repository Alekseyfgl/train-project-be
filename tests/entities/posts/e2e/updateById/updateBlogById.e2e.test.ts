import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { mongo } from '../../../../../src/server/db/mongo';
import { IPost } from '../../../../../src/server/express/types/post/output';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { UpdatePostDto } from '../../../../../src/server/express/types/post/input';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

describe('/posts', () => {
    const client = new MongoClient(mongoURI);

    let newBlog: Nullable<IBlog> = null; // first create blog
    let newPost: Nullable<IPost> = null; // posts for blog

    let correctPostDto: Nullable<UpdatePostDto> = null;

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        newBlog = (await createBlogMock(addMockBlogDto_valid)).body;
        // console.log('newBlog==>', newBlog);
        correctPostDto = {
            blogId: newBlog?.id ?? '1234',
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        };
    });

    afterEach(() => {
        mongo.blogs = [];
        mongo.posts = [];
    });

    // it('+ update post with correct data', async () => {
    //     const { status, body } = await createPostMock(correctPostDto);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newPost = body;
    //
    //     {
    //         const { status } = await updatePostMock(newPost!.id, {
    //             blogId: newBlog!.id,
    //             title: 'Hello world',
    //             content: 'Hello world',
    //             shortDescription: 'Hello world',
    //         });
    //
    //         console.log(mongo.posts);
    //         expect(status).toBe(HttpStatusCodes.NO_CONTENT);
    //     }
    // });

    // it('- update not existing blog', async () => {
    //     const { status, body } = await createPostMock(correctPostDto);
    //
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newPost = body;
    // });

    // it('- update with incorrect name', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             name: '',
    //             description: 'string',
    //             websiteUrl: 'https://www.guru99.com/',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
    //
    // it('- update with without name', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             description: 'string',
    //             websiteUrl: 'https://www.guru99.com/',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
    //
    // it('- update with incorrect description', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             name: 'string',
    //             description: '',
    //             websiteUrl: 'https://www.guru99.com/',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
    //
    // it('- update with without description', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             name: 'string',
    //             websiteUrl: 'https://www.guru99.com/',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
    //
    // it('- update with incorrect websiteUrl', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             name: 'string',
    //             description: '',
    //             websiteUrl: 'ht   ://www.guru99.com/',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
    //
    // it('- update with without websiteUrl', async () => {
    //     const { status, body } = await createPostMock(addMockPostDto_valid);
    //     expect(status).toBe(HttpStatusCodes.CREATED);
    //     newBlog = body;
    //     {
    //         const { status } = await updatePostMock(`${newBlog!.id}`, {
    //             name: 'string',
    //             description: 'description',
    //         });
    //         expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    //     }
    // });
});
