import { Router } from 'express';
import { deviceSessionController } from '../controllers/device-session.controller';
import { checkRefreshTokenMiddleware } from '../common/middlewares/auth/auth.middleware';

export const deviceSessionPath = {
    base: '/security',
    devices: 'devices',
    id: ':id',
};
const { base, id, devices } = deviceSessionPath;
export const deviceSessionRouter = Router();
deviceSessionRouter.get(`${base}/${devices}`, checkRefreshTokenMiddleware, deviceSessionController.getAll);
deviceSessionRouter.delete(`${base}/${devices}`, checkRefreshTokenMiddleware, deviceSessionController.removeAllSessionByUser);
deviceSessionRouter.delete(`${base}/${devices}/:id`, checkRefreshTokenMiddleware, deviceSessionController.removeByDeviceId);
