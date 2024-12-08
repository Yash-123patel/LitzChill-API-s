import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { getAllContestDetails } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";

export async function handlegetAllContest(req: Request) {
    try {
        req;
        // Fetching all contests data from database
        const {contestData,error} = await getAllContestDetails();

        //returning error response if any database error come
        if(error){
            console.log("Database Error during getting all contest data",error);
            return handleDatabaseError(error.message);
         }

        // If contest data is not  found, return a NOT_FOUND error
        if (!contestData || contestData.length == 0) {
            console.log("Error: No contest data found.");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: CONTEST_MODULE_ERROR_MESSAGES.NO_CONTEST_FOUND,
                error_time: new Date(),
            });
        }

        // If contest data is found, return the data in the response
        console.log("Returnnig all contests data ",contestData);
        return   handleAllSuccessResponse(CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_DETAILS_FETCHED,contestData);

    } catch (error) {
        // return an internal server error response
        console.error("Unexpected Error:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
            error_time: new Date(),
        });
    }
}
