import { Http_Method } from "../_shared/_constant/HttpMethods.ts"
import { handleInternalServerError } from "../_errorHandler/ErrorsHandler.ts"
import { handleMethodNotAllowedError } from "../_errorHandler/ErrorsHandler.ts"
import {getContestById} from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts"


Deno.serve(async (req) => {
 try {
  if(req.method===Http_Method.GET){
    return await getContestById(req);
  }
   return handleMethodNotAllowedError(Http_Method.GET);
  
 } catch (error) {
  return handleInternalServerError(`Unexpected Error ${error}`);
 }
})
