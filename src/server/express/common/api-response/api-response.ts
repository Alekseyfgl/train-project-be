import { Response } from 'express';
import { HttpStatusCodes } from '../constans/http-status-codes';
import { ErrorCreator } from '../errors/error-creator/error-creator';
import { HttpExceptionMessages } from '../constans/http-exception-messages';

export class ApiResponse {
    constructor(private readonly res: Response) {}

    send(code: HttpStatusCodes, data?: unknown) {
        this.res.status(code).send(data);
    }

    notFound() {
        this.res.status(HttpStatusCodes.NOT_FOUND).send(new ErrorCreator().add(HttpExceptionMessages.NOT_FOUND));
    }

    badRequest(field: string = '') {
        this.res.status(HttpStatusCodes.BAD_REQUEST).send(new ErrorCreator().add(HttpExceptionMessages.BAD_REQUEST, field));
    }

    notAuthorized() {
        this.res.status(HttpStatusCodes.UNAUTHORIZED).send(new ErrorCreator().add(HttpExceptionMessages.UNAUTHORIZED));
    }

    forbidden() {
        this.res.status(HttpStatusCodes.FORBIDDEN).send(new ErrorCreator().add(HttpExceptionMessages.FORBIDDEN));
    }

    serverError() {
        this.res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(new ErrorCreator().add(HttpExceptionMessages.INTERNAL_SERVER_ERROR));
    }
}
