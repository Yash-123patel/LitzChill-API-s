import { ErrorResponse } from "../_errorHandler/ErrorResponse.ts";
import { HEADER_CONTENT_TYPE } from "../_shared/_commonSuccessMessages/SuccessMessages.ts";

//handling all erros details and returning json as response
export function handleAllErrors(error: ErrorResponse) {
    return new Response(
        JSON.stringify({
            status_code: error.status_code,
            error_message: error.error_message,
            error_time: error.error_time,
        }),
        { 
            status: error.status_code, 
            headers: { [HEADER_CONTENT_TYPE.CONTENT_TYPE_HEADING]: HEADER_CONTENT_TYPE.CONTENT_TYPE_VALUE }
        }
    );
}
