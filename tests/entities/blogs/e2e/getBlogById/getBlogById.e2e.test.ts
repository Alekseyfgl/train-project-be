import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { blogPath } from '../../../../../src/server/express/routes/blog.router';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';

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

    it('get not existing blog', async () => {
        await request(app).post(`/blogs/${1234}`).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('get existing blog', async () => {
        const createdBlog = await createBlogMock(addMockBlogDto_valid);
        expect(createdBlog.status).toBe(HttpStatusCodes.CREATED);
        newBlog = createdBlog.body;

        await request(app).get(`/blogs/${newBlog!.id}`).expect(HttpStatusCodes.OK, newBlog);
    });
});
