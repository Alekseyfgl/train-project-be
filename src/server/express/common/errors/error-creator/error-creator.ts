import { ErrorMessageType } from '../interface/custom-error.interface';

export class ErrorCreator {
    errorsMessages: ErrorMessageType[];

    constructor() {
        this.errorsMessages = [];
    }

    add(message: string, field: string = '') {
        const body: ErrorMessageType = { message, field };
        this.errorsMessages.push(body);
        return this;
    }
}
