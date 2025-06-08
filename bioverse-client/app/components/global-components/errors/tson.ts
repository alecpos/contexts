import { ApiError } from 'next/dist/server/api-utils';
import { ServerErrorType } from './serverError';

export const SERVER_ERRORS: {
    [statusCode: number]: ServerErrorType;
} = {
    404: {
        status: 404,
        statusText: 'Not Found',
    },
};
