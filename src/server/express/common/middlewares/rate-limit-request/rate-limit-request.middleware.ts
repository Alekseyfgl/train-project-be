import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodes } from '../../constans/http-status-codes';
import { RateLimitRequestService } from '../../../service/rate-limit-request.service';
import { QueryRateLimitRequestRepository } from '../../../repositories/rate-limit-request/query-rate-limit-request.repository';
import { ApiResponse } from '../../api-response/api-response';
import dotenv from 'dotenv';

dotenv.config();

export const rateLimitReqMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.networkInfo.ip;

    const url: string = `${req.method} ${req.url}`;
    const counterRequestsByTime: number = await QueryRateLimitRequestRepository.countReqByIpAndUrl(clientIp, url);

    if (counterRequestsByTime >= +process.env.RATE_REQ_LIMIT!) {
        new ApiResponse(res).send(HttpStatusCodes.TOO_MANY_REQUESTS);
        return;
    }
    await RateLimitRequestService.saveIpAndUrl(clientIp, url);
    next();
};
