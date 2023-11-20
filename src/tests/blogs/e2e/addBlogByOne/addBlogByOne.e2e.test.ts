import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../server/express/types/blog/output';
import { app } from '../../../../server/express/app';
import { HttpStatusCodes } from '../../../../server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/blog/createBlog/createBlog.mock';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

describe('/videos', () => {
    let newBlog: Nullable<IBlog> = null;
    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    it('create 1 blog with correct data', async () => {
        const res = await createBlogMock(addMockBlogDto_valid);
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body).not.toBeNull();
        expect(res.body).not.toBeUndefined();

        newBlog = res.body;

        const { status, body } = await request(app).get('/blogs');
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newBlog);
    });

    it('create 1 blog without token', async () => {
        await request(app).post('/blogs').send(addMockBlogDto_valid).expect(HttpStatusCodes.UNAUTHORIZED);
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
