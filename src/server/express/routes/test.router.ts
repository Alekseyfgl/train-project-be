import { NextFunction, Response, Router } from 'express';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';
import { testController } from '../controllers/test.controller';
import { db } from '../../db/db';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';

export const videoPath = {
    base: '/testing',
    id: ':id',
    all_data: 'all-data',
};

const { base, id, all_data } = videoPath;
export const testRouter: Router = Router();

testRouter.get(`${base}`, testController.getRequestCounter);

testRouter.get(`${base}/${all_data}`, (req: any, res: Response, next: NextFunction) => {
    db.blogs.length = 0;
    db.videos.length = 0;
    new ApiResponse(res).send(HttpStatusCodes.NO_CONTENT);
});

testRouter.get(`${base}/samurai`, (req: any, res: Response, next: NextFunction) => {
    // throw new Error('This is a standard error');
    // new CustomError(401).add('one', 'one').add('two', 'two').throw();
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});
