import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../server/express/common/interfaces/optional.types';
import { IBlogSchema } from '../../../../../server/express/types/blog/output';
import { app } from '../../../../../server/express/app';
import { HttpStatusCodes } from '../../../../../server/express/common/constans/http-status-codes';
import { postPath } from '../../../../../server/express/routes/post.router';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import { PostSchema } from '../../../../../server/express/types/post/output';
import { UpdatePostDto } from '../../../../../server/express/types/post/input';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;

const { base, id } = postPath;
describe(`${base}`, () => {
    let newBlog: Nullable<IBlogSchema> = null; // first create blog
    let newPost: Nullable<PostSchema> = null; // posts for blog

    let correctPostDto: Nullable<UpdatePostDto> = null;

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

    it('+ get empty array = []', async () => {
        await request(app).get(`${base}`).expect(HttpStatusCodes.OK, []);
    });

    it('+ get 1 post by blogId', async () => {
        const post = await createPostMock(newBlog!.id);
        expect(post.status).toBe(HttpStatusCodes.CREATED);
        newPost = post.body;

        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newPost);
    });

    it('+ get 2 posts by blogId', async () => {
        const post1 = await createPostMock(newBlog!.id);
        expect(post1.status).toBe(HttpStatusCodes.CREATED);

        const post2 = await createPostMock(newBlog!.id);
        expect(post2.status).toBe(HttpStatusCodes.CREATED);

        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body).toHaveLength(2);
    });
});
