
//created common success response function

import { HEADER_CONTENT_TYPE } from "../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts";

export function handleAllSuccessResponse(message: string, data?: any, statusCode: number =HTTP_STATUS_CODE.OK){

    const responseBody = data ? { message, data } : { message };
    return new Response(
        JSON.stringify({statusCode,responseBody}),
        {
            status: statusCode,
            headers: { [HEADER_CONTENT_TYPE.CONTENT_TYPE_HEADING]:HEADER_CONTENT_TYPE.CONTENT_TYPE_VALUE},
        }
    );
}
