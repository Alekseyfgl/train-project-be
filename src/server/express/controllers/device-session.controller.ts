import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { QueryDeviceSessionRequestRepository } from '../repositories/device-session/query-device-session.repository';
import { IDeviceSession, IDeviceSessionSchema } from '../types/device-session/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { DeviceSessionService } from '../service/device-session.service';

class DeviceSessionController {
    async removeByDeviceId(req: Request<{ id: string }>, res: Response) {
        const userId: Optional<string> = req.user?.userId;
        const activeSession: Optional<IDeviceSessionSchema> = req.deviceSession;
        if (!userId || !activeSession) return new ApiResponse(res).notAuthorized();

        const resultCode: HttpStatusCodes.OK | HttpStatusCodes.FORBIDDEN | HttpStatusCodes.NOT_FOUND = await DeviceSessionService.removeSessionByOne(req.params.id, userId);
        const response = new ApiResponse(res);

        switch (resultCode) {
            case HttpStatusCodes.OK:
                return response.send(resultCode);
            case HttpStatusCodes.NOT_FOUND:
                return response.notFound();
            case HttpStatusCodes.FORBIDDEN:
                return response.forbidden();
            default:
                response.badRequest();
        }
    }

    async getAll(req: Request<{}, {}, {}, {}>, res: Response) {
        const userId: Optional<string> = req.user?.userId;
        if (!userId) return new ApiResponse(res).notAuthorized();

        const result: Nullable<IDeviceSession[]> = await QueryDeviceSessionRequestRepository.findByUserId(userId);
        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }

    async removeAllSessionByUser(req: Request<{}, {}, {}, {}>, res: Response) {
        const userId: Optional<string> = req.user?.userId;
        const currentDeviceId: Optional<string> = req.deviceSession?.deviceId;
        if (!userId || !currentDeviceId) return new ApiResponse(res).notAuthorized();

        const result: boolean = await DeviceSessionService.deleteAllExpectCurrentSession(currentDeviceId, userId);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }
}

export const deviceSessionController = new DeviceSessionController();
