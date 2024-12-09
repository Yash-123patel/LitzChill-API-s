import { ErrorResponse } from "../_errorHandler/ErrorResponse.ts";
import { HEADER_CONTENT_TYPE } from "../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts";

//handling all erros details and returning json as response
export function handleAllErrors(error: ErrorResponse) {
    return new Response(
        JSON.stringify({
            status_code: error.status_code,
            error_message: error.error_message,
            error_time:new Date(),
        }),
        { 
            status: error.status_code, 
            headers: { [HEADER_CONTENT_TYPE.CONTENT_TYPE_HEADING]: HEADER_CONTENT_TYPE.CONTENT_TYPE_VALUE }
        }
    );
}

export function handleDatabaseError(errorMessage:string) {
    return new Response(
        JSON.stringify({statusCode:HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message:COMMON_ERROR_MESSAGES.DATABASE_ERROR,
            errorDetails:errorMessage
        }),
        { 
            status:HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, 
            headers: { [HEADER_CONTENT_TYPE.CONTENT_TYPE_HEADING]: HEADER_CONTENT_TYPE.CONTENT_TYPE_VALUE }
        }
    );
}
