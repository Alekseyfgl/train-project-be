import request from 'supertest';
import { app } from '../../../../../src/server/express/app';
import { UpdateBlogDto } from '../../../../../src/server/express/types/blog/input';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';

export const updateBlogDto_valid: UpdateBlogDto = {
    name: 'Hello',
    description: 'Hello samurai!!!',
    websiteUrl: 'https://www.guru99.com/',
};

export const updateBlogMock = async (id: string, dto: UpdateBlogDto) => {
    return request(app).put(`/blogs/${id}`).set('authorization', authorizationHeader).send(dto);
};
