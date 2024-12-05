import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { COMMENT_VALIDATION_MESSAGES, FLAG_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";


export function validateFlagDetails(flagDetails:FlagModel){

    const validationErrors: string[] = [];

    
    
  // Check for missing fields
  if (!flagDetails.user_id || !flagDetails.contentType || !flagDetails.contentId || !flagDetails.reason) {
      validationErrors.push(FLAG_VALIDATION_MESSAGES.MISSING_FIELDS);
  } 
  
  //validaing user id format
  if (!V4.isValid(flagDetails.user_id)) {
    validationErrors.push(COMMENT_VALIDATION_MESSAGES.INVALID_USER_ID);
  }

  //validating content id format
  if (!V4.isValid(flagDetails.contentId)) {
    validationErrors.push(COMMENT_VALIDATION_MESSAGES.INVALID_CONTENT_ID);
  } 

  //validating reason length
  if(flagDetails.reason.length<=5){
     validationErrors.push(FLAG_VALIDATION_MESSAGES.INVALID_REASON);
  }

  //returning validation error if any error there
  if(validationErrors.length>0){
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.BAD_REQUEST,
      error_message: validationErrors.join(", "),  
      error_time: new Date(),
    });
  }

  //if no error returning empty object
  return {};
}