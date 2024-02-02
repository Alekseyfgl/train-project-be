import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { COOKIE_NAME } from '../common/constans/cookie';
import { IJwtPayload } from '../types/auth/input';
import { JwtService } from '../service/jwt.service';
import { QueryDeviceSessionRequestRepository } from '../repositories/device-session/query-device-session.repository';
import { IDeviceSession, IDeviceSessionSchema } from '../types/device-session/output';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { DeviceSessionService } from '../service/device-session.service';

class DeviceSessionController {
    /**
     * create user like a supper admin
     */
    // async createUser(req: Request<{}, {}, RegistrationUserDto>, res: Response) {
    //     const newUser: Nullable<UserWithConfirm> = await UserService.create(req.body, true);
    //     const response = new ApiResponse(res);
    //
    //     newUser ? response.send(HttpStatusCodes.CREATED, userWithoutConf(newUser)) : response.badRequest();
    // }
    //
    async removeByDeviceId(req: Request<{ id: string }>, res: Response) {
        const refreshTokenFromCookie: Optional<string> = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
        if (!refreshTokenFromCookie) return new ApiResponse(res).notAuthorized();
        //
        const verifiedToken: Nullable<IJwtPayload> = await JwtService.verifyToken(refreshTokenFromCookie);
        if (!verifiedToken) return new ApiResponse(res).notAuthorized();
        const { deviceId, userId } = verifiedToken;

        const activeSession: Nullable<IDeviceSessionSchema> = await QueryDeviceSessionRequestRepository.findByDeviceId(verifiedToken.deviceId);
        if (!activeSession) return false;

        const checkAccess: boolean = DeviceSessionService.checkAccessForSession(activeSession, userId, req.params.id);
        if (!checkAccess) return false;

        const isRemoved = await DeviceSessionService.removeSessionByOne(req.params.id);

        const response = new ApiResponse(res);

        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async getAll(req: Request<{}, {}, {}, {}>, res: Response) {
        const refreshTokenFromCookie: Optional<string> = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
        if (!refreshTokenFromCookie) return new ApiResponse(res).notAuthorized();

        const verifiedToken: Nullable<IJwtPayload> = await JwtService.verifyToken(refreshTokenFromCookie);
        if (!verifiedToken) return new ApiResponse(res).notAuthorized();

        const result: Nullable<IDeviceSession[]> = await QueryDeviceSessionRequestRepository.findByUserId(verifiedToken.userId);
        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }
}

export const deviceSessionController = new DeviceSessionController();
