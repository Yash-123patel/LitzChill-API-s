import { Http_Method } from "../_shared/_constant/HttpMethods.ts"
import { handleInternalServerError } from "../_errorHandler/ErrorsHandler.ts"
import { handleMethodNotAllowedError } from "../_errorHandler/ErrorsHandler.ts"
import { updateContestDetails } from "../_requestHandler/_contest-module-api's/handleUpdateContest.ts"


//in future i need to check user has admin privillege or not.
Deno.serve(async (req) => {
 try {
  if(req.method===Http_Method.PATCH){
    return await updateContestDetails(req);
  }
   return handleMethodNotAllowedError(Http_Method.PATCH);
  
 } catch (error) {
  return handleInternalServerError(`Unexpected Error ${error}`);
 }
})
