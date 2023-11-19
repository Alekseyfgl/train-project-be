export interface ErrorMessageType {
    field: string;
    message: string;
}

export interface ErrorType {
    errorsMessages: ErrorMessageType[];
}
