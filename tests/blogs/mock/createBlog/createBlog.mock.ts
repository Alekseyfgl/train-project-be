import request from 'supertest';
import { app } from '../../../../src/server/express/app';
import { authorizationHeader } from '../base-token/base-token.mock';
import { AddBlogDto } from '../../../../src/server/express/types/blog/input';

export const addMockBlogDto_valid: AddBlogDto = {
    name: 'string',
    description: 'string',
    websiteUrl: 'https://www.guru99.com/',
};

export const createBlogMock = async (blogData: any) => {
    return request(app).post('/blogs').set('authorization', authorizationHeader).send(blogData);
};
