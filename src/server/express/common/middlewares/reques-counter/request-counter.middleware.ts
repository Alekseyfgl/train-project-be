import { NextFunction, Response } from 'express';

export let requestCounter = 0;

export const requestCounterMiddleware = (req: any, res: Response, next: NextFunction) => {
    requestCounter++;
    next();
};
