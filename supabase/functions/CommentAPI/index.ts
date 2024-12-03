import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { handleAddComment } from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts";
import { handleDeleteComment } from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import {
getUserId,
  getUserRole,
  getUserToken,
} from "../_userauthorization/GetUserTokenAndRole.ts";

// Future need to implement: Only comment user or admin can delete the comment

Deno.serve(async (req) => {
  try {
    if (req.method === "POST") {
      return await handleAddComment(req);
    }

    if (req.method === "DELETE") {
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
      const userId=getUserId(userToken);

      if (role === "admin" || role === "anon") {
        return await handleDeleteComment(req);
      }
      return handleAllErrors({
        status_code: Http_Status_Codes.FORBIDDEN,
        error_message: `Unauthorized User for this operation`,
        error_time: new Date(),
      });
    }

    return handleAllErrors({
      status_code: Http_Status_Codes.METHOD_NOT_ALLOWED,
      error_message: `${req.method} Not Allowed for this endpoint`,
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
