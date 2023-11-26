import request from 'supertest';
import { app } from '../../../../../server/express/app';
import { AddBlogDto } from '../../../../../server/express/types/blog/input';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';

export const addMockBlogDto_valid: AddBlogDto = {
    name: 'string',
    description: 'string',
    websiteUrl: 'https://www.guru99.com/',
};

export const createBlogMock = async (blogData: AddBlogDto) => {
    return request(app).post('/blogs').set('authorization', authorizationHeader).send(blogData);
};
