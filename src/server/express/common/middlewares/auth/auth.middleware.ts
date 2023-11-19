import { NextFunction, Request, Response } from 'express';
import { Optional } from '../../interfaces/optional.types';
import { ApiResponse } from '../../api-response/api-response';

const login = 'admin';
const password = 'qwerty';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
