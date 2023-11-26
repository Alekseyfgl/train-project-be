import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { blogPath } from '../../../../../src/server/express/routes/blog.router';
import { init } from '../../../../../src/server/express/init';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.MONGODB_URI_TEST as string;
const { base, id } = blogPath;

describe('/blogs', () => {
    let newBlog: Nullable<IBlogModel> = null;
    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        init.start().then((r) => (r ? console.log('Initialization was successfully') : console.error('Initialization was rejected')));
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        await clearMongoCollections();
    });

    it('create 1 blog with correct data', async () => {
        const res = await createBlogMock(addMockBlogDto_valid);
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body).not.toBeNull();
        expect(res.body).not.toBeUndefined();

        newBlog = res.body;

        const { status, body } = await request(app).get(`${base}`);
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newBlog);
    });

    it('create 1 blog without token', async () => {
        await request(app).post(`${base}`).send(addMockBlogDto_valid).expect(HttpStatusCodes.UNAUTHORIZED);
    });

    it('create 1 blog with incorrect name (length)', async () => {
        const { status, body } = await createBlogMock({
            name: '',
            description: 'string',
            websiteUrl: 'https://www.guru99.com/',
        });
        expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it('create 1 blog with incorrect name (description)', async () => {
        const { status, body } = await createBlogMock({
            name: 'string',
            description: '',
            websiteUrl: 'https://www.guru99.com/',
        });
        expect(status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it('create 1 blog with incorrect name (websiteUrl)', async () => {
        const res = await createBlogMock({ name: 'string', description: '', websiteUrl: 'fdgdfgdfgf' });
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });
});
