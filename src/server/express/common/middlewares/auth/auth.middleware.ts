import { NextFunction, Request, Response } from 'express';

import { Nullable, Optional } from '../../interfaces/optional.types';
import { ApiResponse } from '../../api-response/api-response';
import { IJwtPayload } from '../../../types/auth/input';
import { JwtService } from '../../../service/jwt.service';
import { COOKIE_NAME } from '../../constans/cookie';
import { IDeviceSessionSchema } from '../../../types/device-session/output';
import { QueryDeviceSessionRequestRepository } from '../../../repositories/device-session/query-device-session.repository';
import dotenv from 'dotenv';

dotenv.config();
const login = 'admin';
const password = 'qwerty';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const auth: Optional<string> = req.headers['authorization'];

    if (!auth) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
        new ApiResponse(res).notAuthorized();
        return;
    }

    const decodeData: string = Buffer.from(token, 'base64').toString();
    //admin: qwerty

    const [decodedLogin, decodedPassword] = decodeData.split(':');

    if (decodedLogin !== login || decodedPassword !== password) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    next();
};

export const checkAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //access token in headers
    const token: Optional<string> = req.headers.authorization?.split(' ')[1];
    if (!token) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    const userPayload: Nullable<IJwtPayload> = await JwtService.verifyToken(token, 'access');
    if (!userPayload) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    req.user = userPayload;
    next();
};

/**
 *get refresh token from cookie and add deviceSession and user
 */
export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //refresh token in headers
    const refreshTokenFromCookie: Optional<string> = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
    if (!refreshTokenFromCookie) return new ApiResponse(res).notAuthorized();

    const verifiedToken: Nullable<IJwtPayload> = await JwtService.verifyToken(refreshTokenFromCookie, 'refresh');
    if (!verifiedToken) return new ApiResponse(res).notAuthorized();

    const activeSession: Nullable<IDeviceSessionSchema> = await QueryDeviceSessionRequestRepository.findByDeviceId(verifiedToken.deviceId);
    if (!activeSession) return new ApiResponse(res).notAuthorized();

    if (verifiedToken.iat !== +activeSession.creatAt) return new ApiResponse(res).notAuthorized();

    req.deviceSession = activeSession;
    req.user = verifiedToken;
    next();
};
