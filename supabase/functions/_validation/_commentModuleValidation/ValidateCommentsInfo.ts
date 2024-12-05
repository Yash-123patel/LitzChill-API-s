import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { ArrayContstant } from "../../_shared/_constant/ArrayConstants.ts";
import { CommentValidationMessages } from "../../_shared/_commentModuleMessages/ValidationMessages.ts";

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

  const errorMessages: string[] = [];

  if (!user_id || !contentType || !contentId || !comment) {
    errorMessages.push(CommentValidationMessages.ProvideAllFields);
  }

  if (!V4.isValid(user_id)) {
    errorMessages.push(CommentValidationMessages.InvalidUserId);
  }

  if (!V4.isValid(contentId)) {
    errorMessages.push(CommentValidationMessages.InvalidContentId);
  }

  const validContentTypes = ArrayContstant.CommentContentType;
  if (!validContentTypes.includes(contentType)) {
    errorMessages.push(CommentValidationMessages.InvalidContentType);
  }

  if (errorMessages.length > 0) {
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message: errorMessages.join(", "),  
      error_time: new Date(),
    });
  }


  return {};
}
