import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import { mongo } from '../../../../../src/server/db/mongo';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import { mockNotExistMongoId } from '../../../../common/notExistMongoId/notExistMongoId';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base } = postPath;

describe('/posts', () => {
    let newBlog: Nullable<IBlog> = null; // first create blog

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

    afterEach(() => {
        mongo.blogs = [];
        mongo.posts = [];
    });

    it('+ remove exists post', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        await request(app).delete(`${base}/${body.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NO_CONTENT);
    });

    it('- remove not existing post', async () => {
        await request(app).delete(`${base}/${mockNotExistMongoId}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('- remove for unauthorized user', async () => {
        const { status, body } = await createPostMock(newBlog!.id);
        expect(status).toBe(HttpStatusCodes.CREATED);

        await request(app).delete(`${base}/${body!.id}`).expect(HttpStatusCodes.UNAUTHORIZED);
    });
});
