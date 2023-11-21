import request from 'supertest';
import { app } from '../../../../server/express/app';
import { authorizationHeader } from '../base-token/base-token.mock';
import { postPath } from '../../../../server/express/routes/post.router';
import { UpdatePostDto } from '../../../../server/express/types/post/input';

const { base, id } = postPath;
export const updatePostMock = (id: string, dto: UpdatePostDto) => {
    return request(app).put(`${base}/${id}`).set('authorization', authorizationHeader).send(dto);
};
