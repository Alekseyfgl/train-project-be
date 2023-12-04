import * as dotenv from 'dotenv';
import { Nullable } from '../../../../../server/express/common/interfaces/optional.types';
import { IBlogModel } from '../../../../../server/express/types/blog/output';
import { HttpStatusCodes } from '../../../../../server/express/common/constans/http-status-codes';
import { addMockBlogDto_valid, createBlogMock } from '../../../blogs/mock/createBlog/createBlog.mock';
import { AddPostDto } from '../../../../../server/express/types/post/input';
import { createPostMock } from '../../mock/createPost/createPost.mock';
import { postPath } from '../../../../../server/express/routes/post.router';
import mongoose from 'mongoose';
import { clearMongoCollections } from '../../../../common/clearMongoCollections/clearMongoCollections';
import request from 'supertest';
import { app } from '../../../../../server/express/app';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { mockNotExistMongoId } from '../../../../common/notExistMongoId/notExistMongoId';

dotenv.config();

const mongoURI = process.env.MONGODB_URI_TEST as string;

const { base } = postPath;
describe('[POST] /posts', () => {
    let newBlog: Nullable<IBlogModel> = null; // first create blog

    beforeAll(async () => {
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await clearMongoCollections();
        newBlog = (await createBlogMock(addMockBlogDto_valid)).body;
    });

    afterEach(async () => {
        await clearMongoCollections();
    });

    it('create 1 post for blog with correct data', async () => {
        const { status, body } = await createPostMock(newBlog!.id);

        expect(status).toBe(HttpStatusCodes.CREATED);
        expect(body.blogId).toBe(newBlog!.id);
        expect(body.title).toBe('title');
        expect(body.content).toBe('content');
        expect(body.shortDescription).toBe('shortDescription');
        expect(Object.keys(body!)).toHaveLength(7);
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
    //
    it('- create post with incorrect blogId', async () => {
        return request(app)
            .post(`${base}`)
            .set('authorization', authorizationHeader)
            .send({
                blogId: mockNotExistMongoId,
                title: 'title',
                content: 'content',
                shortDescription: 'shortDescription',
            } as AddPostDto)
            .expect(HttpStatusCodes.BAD_REQUEST);
    });
    //
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
    //
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
    //
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
    //
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
