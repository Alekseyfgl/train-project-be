import request from 'supertest';
import { app } from '../../../../../server/express/app';
import { authorizationHeader } from '../../../../common/base-token/base-token.mock';
import { postPath } from '../../../../../server/express/routes/post.router';
import { UpdatePostDto } from '../../../../../server/express/types/post/input';

const { base, id } = postPath;
export const updatePostMock = (postId: string, dto: UpdatePostDto) => {
    return request(app).put(`${base}/${postId}`).set('authorization', authorizationHeader).send(dto);
};
