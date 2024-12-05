import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";


export function validateFlagDetails(flagDetails:FlagModel){

    const validationErrors: string[] = [];

    
    
  // Check for missing fields
  if (!flagDetails.user_id || !flagDetails.contentType || !flagDetails.contentId || !flagDetails.reason) {
      validationErrors.push("Provide all the fields to add flag");
  } 
  
  if (!V4.isValid(flagDetails.user_id)) {
    validationErrors.push("Invalid User id");
  }

  if (!V4.isValid(flagDetails.contentId)) {
    validationErrors.push("Inavlid Content Id");
  } 

  if(flagDetails.reason.length<=5){
     validationErrors.push("Reason Must between (5-100) letters");
  }

  if(validationErrors.length>0){
    return handleAllErrors({
      status_code: Http_Status_Codes.BAD_REQUEST,
      error_message: validationErrors.join(", "),  
      error_time: new Date(),
    });
  }

  return {};
}