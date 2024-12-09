
import { FlagModel } from "../../_model/FlagModel.ts";
import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { validateFlagDetails } from "../../_validation/_flagModuleValidation/ValidateFlagDetails.ts";
import { FLAG_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { COMMENT_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { FLAG_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { checkUserId } from "../../_QueriesAndTabledDetails/UserModuleQueries.ts";
import { checkContentId, updateFlagCount } from "../../_QueriesAndTabledDetails/MemeModuleQueries.ts";
import { addFlagToMeme, chekUserAlreadyFlag } from "../../_QueriesAndTabledDetails/FlagModuleQueries.ts";
import { checkPrivillege } from "../../_middleware/CheckAuthorization.ts";
import { USER_ROLES } from "../../_shared/_constant/UserRoles.ts";

export async function handleAddFlagRequest(req: Request) {
    try {  
      const userprivillege= await checkPrivillege(req,[USER_ROLES.ADMIN_ROLE,USER_ROLES.USER_ROLE]);

       if(userprivillege instanceof Response){
           return userprivillege;
       }

        // Parsing the request body to get flag details
        const flagData: FlagModel = await req.json();


        // Validating the flag details
        const validationErrors = validateFlagDetails(flagData);
        if (validationErrors instanceof Response) {
            console.log("Validation failed");
            return validationErrors;
        }

        // Checking if the user exists
        const {userData,usererror} = await checkUserId(flagData.user_id);

        if(usererror){
            return handleDatabaseError(usererror.message);
        }

        if (!userData || userData.length == 0) {
            console.log("User not found");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.USER_NOT_FOUND,
                
            });
        }

        // Checking if the meme (content) exists
        const {memeData,memeError} = await checkContentId(flagData.contentId);
        if(memeError){
            return handleDatabaseError(memeError.message);
        }

        if (!memeData || memeData.length == 0) {
            console.log("Meme not found");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.CONTENT_NOT_FOUND,
             
            });
        }

        // Checking if the user has already flagged this meme
        const {userflagData,flagerror} = await chekUserAlreadyFlag(flagData.user_id,memeData[0].meme_id);

        if(flagerror){
            return handleDatabaseError(flagerror.message);
        }
        if (userflagData&&userflagData.length>0) {
            console.log("User has already flagged this meme");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.CONFLICT,
                error_message: FLAG_ERROR_MESSAGES.USER_ALREADY_ADDED_FLAG,
               
            });
        }

        flagData.created_at=new Date();

        // Adding the flag to the meme
        const {addedFlag,error} = await addFlagToMeme(flagData);
        
        if(error)
            handleDatabaseError(error.message);

        if (!addedFlag) {
            console.log("Error during adding flag");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                error_message: FLAG_ERROR_MESSAGES.FLAG_ERROR_DURING_ADDING,
             
            });
        }

       const {countError}= await updateFlagCount(flagData.contentId,memeData[0].flag_count+1);
        // Success response with the added flag details
        console.log("Flag added successfully");

        if(countError)
            return handleDatabaseError(countError.message);

        return handleAllSuccessResponse(FLAG_MODULE_SUCCESS_MESSAGES.FLAG_ADDED,addedFlag,HTTP_STATUS_CODE.CREATED);
         
    } catch (error) {
        // Catching any unexpected errors
        console.error("Unexpected error:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
           
        });
    }
}


