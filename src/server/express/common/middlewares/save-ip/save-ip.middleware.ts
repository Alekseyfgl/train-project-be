import { NextFunction, Request, Response } from 'express';
import { Optional } from '../../interfaces/optional.types';
import { HttpStatusCodes } from '../../constans/http-status-codes';

export const saveIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    let clientIp: Optional<string>;

    if (typeof xForwardedFor === 'string') {
        // Если это строка, то используем split для получения первого IP-адреса.
        clientIp = xForwardedFor.split(',')[0];
    } else if (Array.isArray(xForwardedFor)) {
        // Если это массив строк, просто берем первый элемент массива.
        clientIp = xForwardedFor[0];
    } else {
        // Если заголовок не установлен или его значение не является строкой или массивом строк,
        // то используем IP-адрес, предоставленный Express.js.
        clientIp = req.ip;
    }

    if (!clientIp) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`There is a unknown ip`);
        return;
    }

    console.log('clientIp', clientIp);
    req.networkInfo = {} as any;
    req.networkInfo.ip = clientIp;

    next();
};
