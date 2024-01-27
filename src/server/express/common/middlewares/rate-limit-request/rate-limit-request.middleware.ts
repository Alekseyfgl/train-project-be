import { NextFunction, Request, Response } from 'express';
import { Optional } from '../../interfaces/optional.types';
import { HttpStatusCodes } from '../../constans/http-status-codes';
import { RateLimitRequestService } from '../../../service/rate-limit-request.service';
import { QueryRateLimitRequestRepository } from '../../../repositories/rate-limit-request/query-rate-limit-request.repository';
import { ApiResponse } from '../../api-response/api-response';

export const RateLimitReqMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

    const url: string = `${req.method} ${req.url}`;
    const counterRequestsByTime: number = await QueryRateLimitRequestRepository.countReqByIpAndUrl(clientIp, url);

    console.log('counterRequestsByTime==>', counterRequestsByTime);

    if (counterRequestsByTime >= 5) {
        new ApiResponse(res).send(HttpStatusCodes.TOO_MANY_REQUESTS);
        return;
    }
    await RateLimitRequestService.saveIpAndUrl(clientIp, url);
    next();
};
