import request from 'supertest';
import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { blogPath } from '../../../../../src/server/express/routes/blog.router';
import { addMockBlogDto_valid } from '../../mock/createBlog/createBlog.mock';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import mongoose from 'mongoose';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base, id } = blogPath;

describe('/videos', () => {
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

    it('GET blogs = []', async () => {
        await request(app).get(`${base}`).expect(HttpStatusCodes.OK, []);
    });

    it('GET 1 blog', async () => {
        const createdBlog = await request(app).post(`${base}`).set('authorization', 'Basic YWRtaW46cXdlcnR5').send(addMockBlogDto_valid);
        expect(createdBlog.status).toBe(HttpStatusCodes.CREATED);
        expect(createdBlog.body).not.toBeNull();
        expect(createdBlog.body).not.toBeUndefined();

        newBlog = createdBlog.body;

        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newBlog);
    });
});
