import request from 'supertest';
import { app } from '../../../../src/server/express/app';
import { authorizationHeader } from '../base-token/base-token.mock';
import { postPath } from '../../../../src/server/express/routes/post.router';
import { UpdatePostDto } from '../../../../src/server/express/types/post/input';

const { base, id } = postPath;
export const updatePostMock = (id: string, dto: UpdatePostDto) => {
    return request(app).put(`${base}/${id}`).set('authorization', authorizationHeader).send(dto);
};