import request from 'supertest';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../server/express/types/blog/output';
import { app } from '../../../../server/express/app';
import { HttpStatusCodes } from '../../../../server/express/common/constans/http-status-codes';
import { authorizationHeader } from '../../mock/base-token/base-token.mock';
import { postPath } from '../../../../server/express/routes/post.router';
import { db } from '../../../../server/db/db';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { UpdatePostDto } from '../../../../server/express/types/post/input';
import { IPost } from '../../../../server/express/types/post/output';
import { createPostMock } from '../../mock/createPost/createPost.mock';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;
const { base } = postPath;

describe('/posts', () => {
    let newBlog: Nullable<IBlog> = null; // first create blog
    let newPost: Nullable<IPost> = null; // posts for blog
    let correctPostDto: Nullable<UpdatePostDto> = null;

    const client = new MongoClient(mongoURI);

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        newBlog = (await createBlogMock(addMockBlogDto_valid)).body;
        // console.log('newBlog==>', newBlog);
        correctPostDto = {
            blogId: newBlog?.id ?? '1234',
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        };
        newPost = (await createPostMock(correctPostDto)).body;
    });

    afterEach(() => {
        db.blogs = [];
        db.posts = [];
    });

    it('+ remove exists post', async () => {
        await request(app).delete(`${base}/${newPost!.id}`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NO_CONTENT);
    });

    it('- remove not existing post', async () => {
        await request(app).delete(`${base}/1234`).set('authorization', authorizationHeader).expect(HttpStatusCodes.NOT_FOUND);
    });

    it('- remove for unnaturalized user', async () => {
        await request(app).delete(`${base}/${newPost!.id}`).expect(HttpStatusCodes.UNAUTHORIZED);
    });
});
