import { Router } from 'express';

export const postPath = {
    base: '/post',
    id: ':id',
};
const { base, id } = postPath;
export const postRouter = Router({});
