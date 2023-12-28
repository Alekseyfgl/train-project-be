import { NextFunction, Request, Response } from 'express';

import { Nullable, Optional } from '../../interfaces/optional.types';
import { ApiResponse } from '../../api-response/api-response';
import { AuthService } from '../../../domain/auth.service';
import { IJwtPayload } from '../../../types/auth/input';

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

export const authMiddleware_jwt = async (req: Request, res: Response, next: NextFunction) => {
    const token: Optional<string> = req.headers.authorization?.split(' ')[1];
    if (!token) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    const userPayload: Nullable<IJwtPayload> = await AuthService.verifyToken(token);
    if (!userPayload) {
        new ApiResponse(res).notAuthorized();
        return;
    }

    req.user = userPayload;
    next();
};
