import { Http_Method } from "../_shared/_constant/HttpMethods.ts";
import { createContext } from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { getUserRole, getUserToken } from "../_userauthorization/GetUserTokenAndRole.ts";

// in future i need to check user has admin privilege or not.
Deno.serve(async (req) => {
  try {
    if (req.method === Http_Method.POST) {
      const userToken = getUserToken(req);
      if (!userToken) {
        return handleAllErrors({
          status_code: Http_Status_Codes.FORBIDDEN,
          error_message: `Unauthorized User for this operation`,
          error_time: new Date(),
        });
      }

      const role = getUserRole(userToken);
      console.log(role);

      // later we can remove anon
      if (role === "admin" || role === "anon") {
        return await createContext(req);
      }

      return handleAllErrors({
        status_code: Http_Status_Codes.FORBIDDEN,
        error_message: `Unauthorized User for this operation`,
        error_time: new Date(),
      });
    }

    return handleAllErrors({
      status_code: Http_Status_Codes.METHOD_NOT_ALLOWED,
      error_message: `${req.method} Not allowed for this endpoint`,
      error_time: new Date(),
    });
  } catch (error) {
    return handleAllErrors({
      status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
      error_message: `Internal server error ${error}`,
      error_time: new Date(),
    });
  }
});
