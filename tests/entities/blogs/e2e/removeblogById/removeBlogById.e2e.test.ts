import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../mock/createBlog/createBlog.mock';
import { authorizationHeader } from '../../mock/common/base-token/base-token.mock';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

describe('/blogs', () => {
    let newBlog: Nullable<IBlog> = null;
    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    it('+ create 1 blog with correct data', async () => {
        const res = await createBlogMock(addMockBlogDto_valid);
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body).not.toBeNull();
        expect(res.body).not.toBeUndefined();

        newBlog = res.body;

        await request(app).delete(`/blogs/${newBlog!.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NO_CONTENT);
    });

    it('- remove not exist blog', async () => {
        await request(app).delete(`/blogs/${newBlog!.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('- remove for unnaturalized user', async () => {
        await request(app).delete(`/blogs/${newBlog!.id}`).expect(HttpStatusCodes.UNAUTHORIZED);
    });
});
