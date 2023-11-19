import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../server/express/types/blog/output';
import { app } from '../../../../server/express/app';
import { HttpStatusCodes } from '../../../../server/express/common/constans/http-status-codes';
import { createBlog, mockBlockDto_valid } from '../../mock/createBlock/createBlog.mock';

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

    it('get not existing blog', async () => {
        await request(app).post(`/blogs/${1234}`).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('get existing blog', async () => {
        const createdBlog = await createBlog(mockBlockDto_valid);
        expect(createdBlog.status).toBe(HttpStatusCodes.CREATED);
        newBlog = createdBlog.body;

        await request(app).get(`/blogs/${newBlog!.id}`).expect(HttpStatusCodes.OK, newBlog);
    });
});
