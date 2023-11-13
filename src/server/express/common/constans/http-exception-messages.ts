export enum HttpExceptionMessages {
    BAD_REQUEST = 'Bad request', // 400
    UNAUTHORIZED = 'Unauthorized', // 401
    FORBIDDEN = 'Forbidden', // 403
    NOT_FOUND = 'Resource not found', // 404
    METHOD_NOT_ALLOWED = 'Method not allowed', // 405
    NOT_ACCEPTABLE = 'Not acceptable', // 406
    REQUEST_TIMEOUT = 'Request timeout', // 408
    CONFLICT = 'Conflict', // 409
    GONE = 'Resource gone', // 410
    PAYLOAD_TOO_LARGE = 'Payload too large', // 413
    UNSUPPORTED_MEDIA_TYPE = 'Unsupported media type', // 415
    UNPROCESSABLE_ENTITY = 'Unprocessable entity', // 422
    INTERNAL_SERVER_ERROR = 'Internal server error', // 500
    NOT_IMPLEMENTED = 'Not implemented', // 501
    BAD_GATEWAY = 'Bad gateway', // 502
    SERVICE_UNAVAILABLE = 'Service unavailable', // 503
    GATEWAY_TIMEOUT = 'Gateway timeout', // 504
}
