import { addFlagToMeme } from "../../_repository/_flag-api-repo/AddFlagToMeme.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { validateFlagDetails } from "../../_validation/_flagModuleValidation/ValidateFlagDetails.ts";
import { checkUserId } from "../../_repository/_user-api-repo/CheckUserIsPresent.ts";
import { checkContentId } from "../../_repository/_meme-api-repo/CheckMemeId.ts";
import { userAlreadyFlag } from "../../_repository/_flag-api-repo/checkUserAlreadyFlag.ts";
import { ContestModuleSuccessMessages } from "../../_shared/_contestModuleMessages/SuccessMessages.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { CommentModuleErrorMessages } from "../../_shared/_commentModuleMessages/ErrorMessages.ts";
import { FlagErrorMessages } from "../../_shared/_flagModuleMessages/ErrorMessages.ts";

export async function handleAddFlagRequest(req: Request) {
    try {
        const flagData: FlagModel = await req.json();

        if (Object.keys(flagData).length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message: CommonErrorMessages.EmptyRequestBody,
                error_time: new Date(),
            });
        }

        // Validating flag details.
        const validationErrors = validateFlagDetails(flagData);
        if (validationErrors instanceof Response) {
            return validationErrors;
        }

        // Check if user ID is present
        const userData = await checkUserId(flagData.user_id);
        if (!userData || userData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message: CommentModuleErrorMessages.UserNotFound,
                error_time: new Date(),
            });
        }

        // Check if content ID (meme) is present
        const memeData = await checkContentId(flagData.contentId);
        if (!memeData || memeData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message: CommentModuleErrorMessages.ContentNotFound,
                error_time: new Date(),
            });
        }

        // Check if user has already flagged content
        const userFlag = await userAlreadyFlag(flagData.user_id);
        if (userFlag) {
            return handleAllErrors({
                status_code: Http_Status_Codes.CONFLICT,
                error_message: FlagErrorMessages.USERALREADYADDEDFLAG,
                error_time: new Date(),
            });
        }

        // Adding flag to the meme
        const addedFlag = await addFlagToMeme(flagData);
        if (!addedFlag) {
            return handleAllErrors({
                status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
                error_message: FlagErrorMessages.FLAGERRORDURINGADDING,
                error_time: new Date(),
            });
        }

        return new Response(
            JSON.stringify({
                message: ContestModuleSuccessMessages.ContestCreated,
                data: addedFlag,
            }),
            {
                status: Http_Status_Codes.CREATED,
                headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue }
            }
        );
    } catch (error) {
        return handleAllErrors({
            status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            error_message: `${CommonErrorMessages.InternalServerError} ${error}`,
            error_time: new Date(),
        });
    }
}
