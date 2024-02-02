import { Router } from 'express';
import { deviceSessionController } from '../controllers/device-session.controller';

export const deviceSessionPath = {
    base: '/security',
    devices: 'devices',
    id: ':id',
};
const { base, id, devices } = deviceSessionPath;
export const deviceSessionRouter = Router();
deviceSessionRouter.get(`${base}/${devices}`, deviceSessionController.getAll);
