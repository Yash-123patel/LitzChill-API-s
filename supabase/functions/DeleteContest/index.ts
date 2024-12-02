import { Http_Method } from "../_shared/_constant/HttpMethods.ts"
import { handleInternalServerError } from "../_errorHandler/ErrorsHandler.ts"
import { handleMethodNotAllowedError } from "../_errorHandler/ErrorsHandler.ts"
import { deleteContest } from "../_requestHandler/_contest-module-api's/handleDeleteRequest.ts"


//in future i need to check user has admin privillege or not.
Deno.serve(async (req) => {
 try {
  if(req.method===Http_Method.DELETE){
    return await deleteContest(req);
  }
   return handleMethodNotAllowedError(Http_Method.DELETE);
  
 } catch (error) {
  return handleInternalServerError(`Unexpected Error ${error}`);
 }
})
