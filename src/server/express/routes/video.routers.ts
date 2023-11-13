import { NextFunction, Response, Router } from 'express';
import { videoController } from '../controllers/video.controller';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';

export const videoRouter: Router = Router();

export const videoPath = {
    base: '/videos',
    id: ':id',
};
const { base, id } = videoPath;

videoRouter.get('/', (req: any, res: Response, next: NextFunction) => {
    // Создаем новую ошибку и передаем ее в функцию next
    // throw new Error('This is a standard error');
    // new CustomError(401).add('one', 'one').add('two', 'two').throw();
    res.status(200).send(`hello samurai !!!: requestCounter ${requestCounter}`);
});

videoRouter.delete(`/testing/all-data`, videoController.test);
videoRouter.get(`${base}`, videoController.getAllVideo);
videoRouter.get(`${base}/${id}`, videoController.getVideoById);
videoRouter.post(`${base}`, videoController.addVideo);
videoRouter.put(`${base}/${id}`, videoController.updateVideoById);
videoRouter.delete(`${base}/${id}`, videoController.removeVideo);
