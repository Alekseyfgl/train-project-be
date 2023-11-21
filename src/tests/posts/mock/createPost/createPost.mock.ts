import request from 'supertest';
import { app } from '../../../../server/express/app';
import { authorizationHeader } from '../base-token/base-token.mock';
import { postPath } from '../../../../server/express/routes/post.router';
import { AddPostDto } from '../../../../server/express/types/post/input';

export const addMockPostDto_valid: AddPostDto = {
    blogId: 'blogId',
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content',
};
const { base, id } = postPath;
export const createPostMock = async (postData: AddPostDto) => {
    return request(app).post(`${base}`).set('authorization', authorizationHeader).send(postData);
};
