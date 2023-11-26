import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../../src/server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../../src/server/express/types/blog/output';
import { app } from '../../../../../src/server/express/app';
import { HttpStatusCodes } from '../../../../../src/server/express/common/constans/http-status-codes';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import { addMockPostDto_valid, createPostMock } from '../../mock/createPost/createPost.mock';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;
const { base } = postPath;
describe('/posts', () => {
    let newBlog: Nullable<IBlog> = null;
    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    it('get not existing post', async () => {
        await request(app).post(`${base}/${1234}`).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('get existing post', async () => {
        const createdPost = await createPostMock(addMockPostDto_valid);
        expect(createdPost.status).toBe(HttpStatusCodes.CREATED);
        newBlog = createdPost.body;

        await request(app).get(`${base}/${newBlog!.id}`).expect(HttpStatusCodes.OK, newBlog);
    });
});
