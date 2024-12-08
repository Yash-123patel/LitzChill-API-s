import { ContestModel } from "../../_model/ContestModel.ts";
import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { CONTEST_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { updateContestById } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";

export async function handleupdateContestDetails(req: Request,params: string) {
    try {
        const contest_id =params;

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

        // Validate the contest details
        const validationErrors = validateContestDetails(contestDetails, true);

        if (validationErrors instanceof Response) {
            console.error("Validation failed:", validationErrors);
            return validationErrors;
        }

        
        contestDetails.contest_id = contest_id;
        contestDetails.updated_at = new Date().toISOString();

        //calling update contest query
        const {updatedContest,error} = await updateContestById(contestDetails);

        //returning error response if any database error come
        if(error){
            console.log("Database Error during updating contest data",error);
            return handleDatabaseError(error.message);
        }

        // If contest not found with id or no data is updated, return an error
        if (!updatedContest || updatedContest.length == 0) {
            console.error(`No contest found for ID: ${contest_id} or it was deleted`);
            return handleAllErrors({
                 status_code: HTTP_STATUS_CODE.NOT_FOUND,
                 error_message: CONTEST_MODULE_ERROR_MESSAGES.CONTEST_NOT_FOUND_OR_DELETED,
                 error_time: new Date(),
            });
        }

        // Return the updated contest details
        console.log("Contest updated successfully:", updatedContest);
        
        return  handleAllSuccessResponse(CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_UPDATED,updatedContest);
       
    } catch (error) {
        // internal server response
        console.error("Internal  error during contest update:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.NOT_FOUND,
            error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
            error_time: new Date(),
        });
    }
}
