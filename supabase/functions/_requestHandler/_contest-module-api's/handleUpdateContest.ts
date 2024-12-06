import { ContestModel } from "../../_model/_contestModules/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { updateContestById } from "../../_repository/_contest-api-repo/UpdateContestDetails.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";

import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { CONTEST_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";

export async function updateContestDetails(req: Request) {
    try {
        // Extract contest_id from the URL path
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const contest_id = path[path.length - 1];

        console.log(`Received request to update contest with ID: ${contest_id}`);

        // Validate the contest_id
        if (!contest_id || !V4.isValid(contest_id)) {
            console.error(`Invalid contest ID: ${contest_id}`);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: CONTEST_VALIDATION_MESSAGES.INVALID_CONTEST_ID,
                error_time: new Date(),
            });
        }

        // Get contest details from the request body
        const contestDetails: Partial<ContestModel> = await req.json();
        console.log("Received contest details for update:", contestDetails);

        // Check if the request body is empty
        if (Object.keys(contestDetails).length === 0) {
            console.error("Empty request body");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: COMMON_ERROR_MESSAGES.EMPTY_REQUEST_BODY,
                error_time: new Date(),
            });
        }

        // Assign contest_id to the request body
        contestDetails.contestid = contest_id;

        // Validate the contest details
        const validationErrors = validateContestDetails(contestDetails, true);
        if (validationErrors instanceof Response) {
            console.error("Validation failed:", validationErrors);
            return validationErrors;
        }

        // Set the updated_at field
        contestDetails.updatedat = new Date().toISOString();
        console.log(`Updating contest ID: ${contest_id} with details: ${JSON.stringify(contestDetails)}`);

        const updatedData = await updateContestById(contestDetails);

        // If no data is updated, return an error
        if (!updatedData || updatedData.length == 0) {
            console.error(`No contest found for ID: ${contest_id} or it was already deleted`);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: CONTEST_MODULE_ERROR_MESSAGES.CONTEST_NOT_FOUND_OR_DELETED,
                error_time: new Date(),
            });
        }

        // Return the updated contest details
        console.log("Contest updated successfully:", updatedData);
        
        return  handleAllSuccessResponse(CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_UPDATED,updatedData);
       
    } catch (error) {
        // internal server response
        console.error("Unexpected error during contest update:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.NOT_FOUND,
            error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
            error_time: new Date(),
        });
    }
}
