import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../server/express/common/interfaces/optional.types';
import { IBlogSchema } from '../../../../../server/express/types/blog/output';
import { app } from '../../../../../server/express/app';
import { HttpStatusCodes } from '../../../../../server/express/common/constans/http-status-codes';
import { postPath } from '../../../../../server/express/routes/post.router';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { mockNotExistMongoId } from '../../../../common/notExistMongoId/notExistMongoId';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base } = postPath;

describe(`${base}`, () => {
    let newBlog: Nullable<IBlogSchema> = null; // first create blog

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

    it('get not existing post', async () => {
        await request(app).post(`${base}/${mockNotExistMongoId}`).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('get existing post', async () => {
        const createdPost = await createPostMock(newBlog!.id);
        expect(createdPost.status).toBe(HttpStatusCodes.CREATED);
        newBlog = createdPost.body;

        await request(app).get(`${base}/${newBlog!.id}`).expect(HttpStatusCodes.OK, newBlog);
    });
});
