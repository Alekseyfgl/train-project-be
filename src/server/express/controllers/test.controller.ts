import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { requestCounter } from '../common/middlewares/reques-counter/request-counter.middleware';

class TestController {
    async getRequestCounter(req: Request, res: Response, next: NextFunction) {
        new ApiResponse(res).send(HttpStatusCodes.OK, `Request counter: ${requestCounter}`);
    }

    async dropApp(req: Request, res: Response, next: NextFunction) {
        throw new Error('Произошла ошибка, вы намеренно уронили сервис');
        new ApiResponse(res).send(HttpStatusCodes.OK);
    }
}

export const testController = new TestController();
