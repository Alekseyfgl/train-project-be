import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { AddBlogDto } from '../../../../../src/server/express/types/blog/input';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

const mockBlock: AddBlogDto = {
    name: 'string',
    description: 'string',
    websiteUrl: 'https://www.guru99.com/',
};

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

    it('GET blogs = []', async () => {
        await request(app).get('/blogs').expect(HttpStatusCodes.OK, []);
    });

    it('GET 1 blog', async () => {
        const createdBlog = await request(app).post('/blogs').set('authorization', 'Basic YWRtaW46cXdlcnR5').send(mockBlock);
        expect(createdBlog.status).toBe(HttpStatusCodes.CREATED);
        expect(createdBlog.body).not.toBeNull();
        expect(createdBlog.body).not.toBeUndefined();

        newBlog = createdBlog.body;

        const { status, body } = await request(app).get('/blogs');
        expect(status).toBe(HttpStatusCodes.OK);
        expect(body[0]).toEqual(newBlog);
    });
});
