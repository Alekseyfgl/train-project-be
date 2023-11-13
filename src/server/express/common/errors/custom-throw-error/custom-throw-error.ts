import { ErrorType } from './custom-throw-error.interface';
import { HttpStatusCodes } from '../../constans/http-status-codes';

export class CustomError extends Error {
    public status: number;
    public errors: ErrorType;

    constructor(status: number = HttpStatusCodes.INTERNAL_SERVER_ERROR) {
        super();
        this.status = status;
        this.errors = { errorsMessages: [] };

        Error.captureStackTrace(this, this.constructor);
    }

    // you can add extra messages
    add(message: string, field: string) {
        this.errors.errorsMessages.push({ message, field });
        return this;
    }

    // new CustomError().addMessage('','').throw()
    // you can you this method instead of classic throw new ....;
    throw() {
        throw this;
    }
}
