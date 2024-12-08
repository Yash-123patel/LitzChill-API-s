import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { ArrayContstant } from "../../_shared/_constant/ArrayConstants.ts";
import { COMMENT_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";

export function validateCommentDetails({
  user_id,
  contentType,
  meme_id,
  comment,
}: {
  user_id: string;
  contentType: string;
  meme_id: string;
  comment: string;
}) {
  const errorMessages: string[] = [];
  console.log("Validating comment details...");

  // Check if all required fields are provided
  if (!user_id || !contentType || !meme_id || !comment) {
    console.log("Missing required fields in the input data.");
    errorMessages.push(COMMENT_VALIDATION_MESSAGES.PROVIDE_ALL_FIELDS);
  }

  // Validate user_id format (UUID v4)
  if (!V4.isValid(user_id)) {
    console.log(`Invalid user_id: ${user_id}`);
    errorMessages.push(COMMENT_VALIDATION_MESSAGES.INVALID_USER_ID);
  }

  // Validate contentId format (UUID v4)
  if (!V4.isValid(meme_id)) {
    console.log(`Invalid contentId: ${meme_id}`);
    errorMessages.push(COMMENT_VALIDATION_MESSAGES.INVALID_CONTENT_ID);
  }

  // Validate contentType against allowed values
  const validContentTypes = ArrayContstant.COMMENT_CONTENT_TYPE;
  if (!validContentTypes.includes(contentType)) {
    console.log(`Invalid contentType: ${contentType}. Allowed types: ${validContentTypes.join(", ")}`);
    errorMessages.push(COMMENT_VALIDATION_MESSAGES.INVALID_CONTENT_TYPE);
  }

  // If there are validation errors, handle them and return the response
  if (errorMessages.length > 0) {
    console.log("Validation failed. Errors:", errorMessages);
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.BAD_REQUEST,
      error_message: errorMessages.join(", "), // Combine all error messages
      error_time: new Date(),
    });
  }

  // Validation passed successfully
  console.log("Comment details validated successfully.");
  return {};
}
