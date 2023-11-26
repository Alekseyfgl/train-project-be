import request from 'supertest';
import { app } from '../../../../../server/express/app';
import { UpdateBlogDto } from '../../../../../server/express/types/blog/input';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { blogPath } from '../../../../../server/express/routes/blog.router';

export const updateBlogDto_valid: UpdateBlogDto = {
    name: 'Hello',
    description: 'Hello samurai!!!',
    websiteUrl: 'https://www.guru99.com/',
};
const { base, id } = blogPath;
export const updateBlogMock = async (id: string, dto: UpdateBlogDto) => {
    return request(app).put(`${base}/${id}`).set('authorization', authorizationHeader).send(dto);
};
