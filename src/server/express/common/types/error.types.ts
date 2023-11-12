export type ErrorMessageType = {
    field: string;
    message: string;
};

export type ErrorType = {
    errorsMessages: ErrorMessageType[];
};
