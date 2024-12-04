import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";

export function validateCommentDetails({
  user_id,
  contentType,
  contentId,
  comment,
}: {
  user_id: string;
  contentType: string;
  contentId: string;
  comment: string;
}) {

  // Check for missing fields
  if (!user_id || !contentType || !contentId || !comment) {
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message: "Provide all the required fields",
      error_time: new Date(),
    });
  }

  // Validate UUIDs
  if (!V4.isValid(user_id)) {
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message:
        "Invalid user_id. Please provide a valid user_id in UUID format.",
      error_time: new Date(),
    });
  }
  if (!V4.isValid(contentId)) {
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message:
        "Invalid contentId. Please provide a valid contentId in UUID format.",
      error_time: new Date(),
    });
  }

 
  // Validate content type
  const validContentTypes = ["memes", "comment"];
  if (!validContentTypes.includes(contentType)) {
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message: "Invalid content type. Only 'memes' or 'comment' allowed.",
      error_time: new Date(),
    });
  }

  // If validation passes
  return null;
}
