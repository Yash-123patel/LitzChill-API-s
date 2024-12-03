import { Http_Method } from "../_shared/_constant/HttpMethods.ts";
import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { getContestById } from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";

Deno.serve(async (req) => {
  try {
    if (req.method === Http_Method.GET) {
      return await getContestById(req);
    }

    return handleAllErrors({
      status_code: Http_Status_Codes.METHOD_NOT_ALLOWED,
      error_message: `${req.method} Not allowd for this endpoint`,
      error_time: new Date(),
    });
    
  } catch (error) {
    return handleAllErrors({
      status_code: Http_Status_Codes.METHOD_NOT_ALLOWED,
      error_message: `Internal Server error ${error}`,
      error_time: new Date(),
    });
  }
});
