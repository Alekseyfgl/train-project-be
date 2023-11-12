import { Request, Response, Router } from 'express';
import { videoController } from '../controllers/video.controller';

export const videoRouter: Router = Router();

export const videoPath = {
    base: '/videos',
    id: ':id',
};
const { base, id } = videoPath;

videoRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello samurai');
});
videoRouter.delete(`/testing/all-data`, videoController.test);
videoRouter.get(`${base}`, videoController.getAllVideo);
videoRouter.get(`${base}/${id}`, videoController.getVideoById);
videoRouter.post(`${base}`, videoController.addVideo);
videoRouter.put(`${base}/${id}`, videoController.updateVideoById);
videoRouter.delete(`${base}/${id}`, videoController.removeVideo);
