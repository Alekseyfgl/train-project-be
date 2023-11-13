import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../custom-throw-error/custom-throw-error';
import { HttpExceptionMessages } from '../../constans/http-exception-messages';
import { HttpStatusCodes } from '../../constans/http-status-codes';

export const exceptionFilter = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
    //
    if (err instanceof CustomError) {
        // if err is instance of CustomError
        if (!err.errors.errorsMessages.length) {
            err.add(err.message, '');
        }
        return res.status(err.status).send({
            errors: err.errors,
        });
    }

    // This is unexpected Error
    console.error(err);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        errorsMessages: [{ message: HttpExceptionMessages.INTERNAL_SERVER_ERROR, field: '' }],
    });
};
