import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';

export const commentPath = {
    base: '/comments',
    id: ':id',
};
const { base, id } = commentPath;
export const commentRouter = Router();

commentRouter.get(`${base}/${id}`, commentController.getById);
