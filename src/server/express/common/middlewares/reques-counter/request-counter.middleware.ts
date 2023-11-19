import { NextFunction, Request, Response } from 'express';

export let requestCounter = 0;

export const requestCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestCounter++;
    next();
};
