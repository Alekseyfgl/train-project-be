import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import { IPost } from '../../../../../src/server/express/types/post/output';
import { UpdatePostDto } from '../../../../../src/server/express/types/post/input';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { mongo } from '../../../../../src/server/db/mongo';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;
const { base, id } = postPath;
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
    });

    afterEach(() => {
        mongo.blogs = [];
        mongo.posts = [];
    });

    it('+ get empty array = []', async () => {
        await request(app).get(`${base}`).expect(HttpStatusCodes.OK, []);
    });

    it('+ get 1 post by blogId', async () => {
        const post = await createPostMock({
            blogId: newBlog!.id,
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        });
        expect(post.status).toBe(HttpStatusCodes.CREATED);
        newPost = post.body;

        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newPost);
    });

    it('+ get 2 posts by blogId', async () => {
        const post1 = await createPostMock({
            blogId: newBlog!.id,
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        });
        expect(post1.status).toBe(HttpStatusCodes.CREATED);
        const post2 = await createPostMock({
            blogId: newBlog!.id,
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        });
        expect(post2.status).toBe(HttpStatusCodes.CREATED);
        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body).toHaveLength(2);
    });
});
