import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { CONTEST_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { getContestDetailsById } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";

export async function handlegetContestById(req: Request,params: string) {
    try {
        console.log(params);
        const contest_id =params;


        console.log(`Received request to get contest with ID: ${contest_id}`);

        // Validate the contest_id
        if (!contest_id || !V4.isValid(contest_id)) {
            console.error(`Invalid contest ID: ${contest_id}`);
            return handleAllErrors({
                 status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                 error_message: CONTEST_VALIDATION_MESSAGES.INVALID_CONTEST_ID,
                 error_time: new Date(),
            });
        }

        // Fetch contest details from the database
        const {contestData,error} = await getContestDetailsById(contest_id);
        
       //returning error response if any database error come
        if(error){
            console.log("Database Error during getting contest data",error);
            return handleDatabaseError(error.message);
        }

        // If no contest data found, return an not found response
        if (!contestData || contestData.length == 0) {
            console.error(`No contest found for ID: ${contest_id}`);
            return handleAllErrors({
                 status_code: HTTP_STATUS_CODE.NOT_FOUND,
                 error_message: CONTEST_MODULE_ERROR_MESSAGES.CONTEST_NOT_FOUND_OR_DELETED,
                 error_time: new Date(),
            });
        }

        // Return success response with contest details
        console.log(`Returning contest details : ${contestData}`);

        return handleAllSuccessResponse(CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_DETAILS_FETCHED,contestData);
       
    } catch (error) {
        // return internal server response
        console.error("Unexpected Error:", error);
        return handleAllErrors({
             status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
             error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
             error_time: new Date(),
        });
    }
}
