import { addFlagToMeme } from "../../_repository/_flag-api-repo/AddFlagToMeme.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { validateFlagDetails } from "../../_validation/_flagModuleValidation/ValidateFlagDetails.ts";
import { checkUserId } from "../../_repository/_user-api-repo/CheckUserIsPresent.ts";
import { checkContentId } from "../../_repository/_meme-api-repo/CheckMemeId.ts";
import { userAlreadyFlag } from "../../_repository/_flag-api-repo/checkUserAlreadyFlag.ts";
import { FLAG_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { COMMENT_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { FLAG_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";

export async function handleAddFlagRequest(req: Request) {
    try {
        // Parsing the request body to get flag details
        const flagData: FlagModel = await req.json();

        // Checking if the flag data is empty
        if (Object.keys(flagData).length == 0) {
            console.log("Empty request body");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: COMMON_ERROR_MESSAGES.EMPTY_REQUEST_BODY,
                error_time: new Date(),
            });
        }

        // Validating the flag details
        const validationErrors = validateFlagDetails(flagData);
        if (validationErrors instanceof Response) {
            console.log("Validation failed");
            return validationErrors;
        }

        // Checking if the user exists
        const userData = await checkUserId(flagData.user_id);
        if (!userData || userData.length == 0) {
            console.log("User not found");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.USER_NOT_FOUND,
                error_time: new Date(),
            });
        }

        // Checking if the meme (content) exists
        const memeData = await checkContentId(flagData.contentId);
        if (!memeData || memeData.length == 0) {
            console.log("Meme not found");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.CONTENT_NOT_FOUND,
                error_time: new Date(),
            });
        }

        // Checking if the user has already flagged this meme
        const userFlag = await userAlreadyFlag(flagData.user_id);
        if (userFlag) {
            console.log("User has already flagged this meme");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.CONFLICT,
                error_message: FLAG_ERROR_MESSAGES.USER_ALREADY_ADDED_FLAG,
                error_time: new Date(),
            });
        }

        // Adding the flag to the meme
        const addedFlag = await addFlagToMeme(flagData);
        if (!addedFlag) {
            console.log("Error during adding flag");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                error_message: FLAG_ERROR_MESSAGES.FLAG_ERROR_DURING_ADDING,
                error_time: new Date(),
            });
        }

        // Success response with the added flag details
        console.log("Flag added successfully");

        return handleAllSuccessResponse(FLAG_MODULE_SUCCESS_MESSAGES.FLAG_ADDED,addedFlag,HTTP_STATUS_CODE.CREATED);
         
    } catch (error) {
        // Catching any unexpected errors
        console.error("Unexpected error:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
            error_time: new Date(),
        });
    }
}
