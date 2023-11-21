import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Nullable } from '../../../../server/express/common/interfaces/optional.types';
import { IBlog } from '../../../../server/express/types/blog/output';
import { HttpStatusCodes } from '../../../../server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { db } from '../../../../server/db/db';
import { IPost } from '../../../../server/express/types/post/output';
import { AddPostDto, UpdatePostDto } from '../../../../server/express/types/post/input';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import request from 'supertest';
import { app } from '../../../../server/express/app';
import { postPath } from '../../../../server/express/routes/post.router';
import { authorizationHeader } from '../../../blogs/mock/base-token/base-token.mock';

dotenv.config();

const dbName = 'back';
const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017/${dbName}`;

const { base } = postPath;
describe('[POST] /posts', () => {
    const client = new MongoClient(mongoURI);

    let newBlog: Nullable<IBlog> = null; // first create blog
    let newPost: Nullable<IPost> = null; // posts for blog

    let correctPostDto: Nullable<UpdatePostDto> = null;

    beforeAll(async () => {
        await client.connect();
        //  await request(app).delete('/testing/all-data').expect(HttpStatusCodes.NO_CONTENT);
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(async () => {
        newBlog = (await createBlogMock(addMockBlogDto_valid)).body;
    });

    afterEach(() => {
        db.blogs = [];
        db.posts = [];
    });

    it('create 1 post for blog with correct data', async () => {
        const blog = await createBlogMock(addMockBlogDto_valid);
        expect(blog.status).toBe(HttpStatusCodes.CREATED);
        newBlog = blog.body;

        const post = await createPostMock({
            blogId: newBlog!.id,
            title: 'title',
            content: 'content',
            shortDescription: 'shortDescription',
        });
        newPost = post.body;
        expect(post.status).toBe(HttpStatusCodes.CREATED);
        expect(newPost!.blogId).toBe(newBlog!.id);
        expect(newPost!.title).toBe('title');
        expect(newPost!.content).toBe('content');
        expect(newPost!.shortDescription).toBe('shortDescription');
        expect(Object.keys(newPost!)).toHaveLength(6);
    });

    it('- create post without auth', async () => {
        return request(app)
            .post(`${base}`)
            .send({
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
                shortDescription: 'shortDescription',
            } as AddPostDto)
            .expect(HttpStatusCodes.UNAUTHORIZED);
    });

    it('- create post with incorrect blogId', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: '1234',
                title: 'title',
                content: 'content',
                shortDescription: 'shortDescription',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });

    it('- create post with incorrect title', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: newBlog!.id,
                title: '',
                content: 'content',
                shortDescription: 'shortDescription',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });

    it('- create post with incorrect content', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: newBlog!.id,
                title: 'title',
                content: '',
                shortDescription: 'shortDescription',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });

    it('- create post with incorrect shortDescription', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: newBlog!.id,
                title: 'title',
                content: 'content',
                shortDescription: '',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });

    it('- create post without key of title', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: newBlog!.id,
                content: 'content',
                shortDescription: '',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });
});
