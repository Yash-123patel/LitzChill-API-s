import { ErrorResponseImpl } from "../_errorHandler/ErrorResponse.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";

//handle badrequest error
export function handleBadRequestError(errorMessage: string) {
    return new Response(
        JSON.stringify(new ErrorResponseImpl(
            Http_Status_Codes.BAD_REQUEST,  
            errorMessage, 
            new Date()
        )),
        {status: Http_Status_Codes.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
    );
}
//handle notfound error
export  function handleNotFoundError(errorMessage: string) {
    return new Response(
        JSON.stringify(new ErrorResponseImpl(
            Http_Status_Codes.NOT_FOUND,  
            errorMessage, 
            new Date()
        )),
        {status: Http_Status_Codes.NOT_FOUND, headers: { "Content-Type": "application/json" } }
    );
}

//handle internal server error
export function handleInternalServerError(errorMessage: string) {
    return new Response(
        JSON.stringify(new ErrorResponseImpl(
            Http_Status_Codes.INTERNAL_SERVER_ERROR,  
            errorMessage, 
            new Date()
        )),
        {status: Http_Status_Codes.INTERNAL_SERVER_ERROR, headers: { "Content-Type": "application/json" } }
    );
}
//handle method not allowed error
export function handleMethodNotAllowedError(method:string){
    return new Response(
        JSON.stringify(new ErrorResponseImpl(Http_Status_Codes.METHOD_NOT_ALLOWED,`Only ${method} Method Allowed For This Operation`,new Date())),
        { status:Http_Status_Codes.METHOD_NOT_ALLOWED,headers: { "Content-Type": "application/json" } },
      )
}

