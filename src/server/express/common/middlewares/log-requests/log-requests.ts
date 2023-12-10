import { NextFunction, Request, Response } from 'express';

export const logRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    const url = req.originalUrl;
    console.log(`${new Date().toISOString()} - ${method} ${url}`);
    next(); // Передаем управление следующему middleware
};
