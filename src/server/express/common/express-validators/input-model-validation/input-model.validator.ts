import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { HttpStatusCodes } from '../../constans/http-status-codes';

export const inputModelValidator = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req).formatWith((error: ValidationError) => {
        return {
            message: error.msg,
            field: error.type === 'field' ? error.path : '',
        };
    });

    if (!errors.isEmpty()) {
        const err = errors.array({ onlyFirstError: true });
        res.status(HttpStatusCodes.BAD_REQUEST).send({ errorsMessages: err });
        return;
    }

    next();
};
