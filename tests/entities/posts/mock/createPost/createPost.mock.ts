import request from 'supertest';
import { app } from '../../../../../src/server/express/app';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import { AddPostDto } from '../../../../../src/server/express/types/post/input';

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
