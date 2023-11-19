import { NextFunction, Response, Router } from 'express';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';

export const videoPath = {
    base: '/testing',
    id: ':id',
    all_data: 'all-data',
};

const { base, id, all_data } = videoPath;
export const testRouter: Router = Router();

testRouter.get(`${base}`, (req: any, res: Response, next: NextFunction) => {
    // Создаем новую ошибку и передаем ее в функцию next
    // throw new Error('This is a standard error');
    // new CustomError(401).add('one', 'one').add('two', 'two').throw();
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});

testRouter.get(`${base}/${all_data}`, (req: any, res: Response, next: NextFunction) => {
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});
