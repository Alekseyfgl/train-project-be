import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../server/express/types/blog/output';
import { app } from '../../../../../server/express/app';
import { HttpStatusCodes } from '../../../../../server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { blogPath } from '../../../../../server/express/routes/blog.router';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base, id } = blogPath;

describe(`${base}`, () => {
    let newBlog: Nullable<IBlogModel> = null;

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await clearMongoCollections();
    });

    it('+ create 1 blog with correct data', async () => {
        const res = await createBlogMock(addMockBlogDto_valid);
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body).not.toBeNull();
        expect(res.body).not.toBeUndefined();

        newBlog = res.body;

        await request(app).delete(`${base}/${newBlog!.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NO_CONTENT);
    });

    it('- remove not exist blog', async () => {
        await request(app).delete(`${base}/${newBlog!.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('- remove for unnaturalized user', async () => {
        await request(app).delete(`${base}/${newBlog!.id}`).expect(HttpStatusCodes.UNAUTHORIZED);
    });
});
