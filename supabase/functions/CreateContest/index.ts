import { Http_Method } from "../_shared/_constant/HttpMethods.ts"
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts"
import { ErrorResponseImpl } from "../_errorHandler/ErrorResponse.ts"
import { createContext } from "../_requestHandler/handleCreateContestReq.ts"

Deno.serve(async (req) => {
  if(req.method===Http_Method.POST){
    return await createContext(req);
  }

  return new Response(
    JSON.stringify(new ErrorResponseImpl(Http_Status_Codes.METHOD_NOT_ALLOWED,"Only POST Method Allowed For This Operation",new Date())),
    { status:Http_Status_Codes.METHOD_NOT_ALLOWED,headers: { "Content-Type": "application/json" } },
  )
})
