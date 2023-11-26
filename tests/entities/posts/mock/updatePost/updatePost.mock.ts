import request from 'supertest';
import { app } from '../../../../../src/server/express/app';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { postPath } from '../../../../../src/server/express/routes/post.router';
import { UpdatePostDto } from '../../../../../src/server/express/types/post/input';

const { base, id } = postPath;
export const updatePostMock = (postId: string, dto: UpdatePostDto) => {
    return request(app).put(`${base}/${postId}`).set('authorization', authorizationHeader).send(dto);
};
