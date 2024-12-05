import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { getAllContestDetails } from "../../_repository/_contest-api-repo/GetAllContestRepository.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";

import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";

export async function getAllContest(req: Request) {
    try {
        req;
        // Fetch all contest data from the repository
        const contestData = await getAllContestDetails();

        // If no contest data is found, return a NOT_FOUND error
        if (!contestData || contestData.length == 0) {
            console.log("Error: No contest data found.");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: CONTEST_MODULE_ERROR_MESSAGES.NO_CONTEST_FOUND,
                error_time: new Date(),
            });
        }

        // If contest data is found, return the data in the response
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
