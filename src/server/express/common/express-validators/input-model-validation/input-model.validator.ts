import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { HttpStatusCodes } from '../../constans/http-status-codes';

export const inputModelValidator = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req).formatWith((error: ValidationError) => {
        if (typeof error.msg === 'string') {
            return {
                message: error.msg,
                field: error.type === 'field' ? error.path : '',
            };
        } else {
            return {
                ...error.msg, // распаковываем объект сообщения ошибки
            };
        }
    });

    if (!errors.isEmpty()) {
        const err = errors.array({ onlyFirstError: true });
        res.status(HttpStatusCodes.BAD_REQUEST).send({ errorsMessages: err });
        return;
    }

    next();
};
