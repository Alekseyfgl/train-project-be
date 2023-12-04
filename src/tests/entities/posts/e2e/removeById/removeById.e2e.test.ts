import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../server/express/types/blog/output';
import { app } from '../../../../../server/express/app';
import { HttpStatusCodes } from '../../../../../server/express/common/constans/http-status-codes';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { postPath } from '../../../../../server/express/routes/post.router';
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
