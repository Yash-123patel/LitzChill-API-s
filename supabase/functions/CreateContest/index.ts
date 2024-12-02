import { Http_Method } from "../_shared/_constant/HttpMethods.ts"
import { createContext } from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts"
import { handleInternalServerError } from "../_errorHandler/ErrorsHandler.ts"
import { handleMethodNotAllowedError } from "../_errorHandler/ErrorsHandler.ts"


//in future i need to check user has admin privillege or not.
Deno.serve(async (req) => {
 try {
  if(req.method===Http_Method.POST){
    return await createContext(req);
  }
   return handleMethodNotAllowedError(Http_Method.POST);
  
 } catch (error) {
  return handleInternalServerError(`Unexpected Error ${error}`);
 }
})
