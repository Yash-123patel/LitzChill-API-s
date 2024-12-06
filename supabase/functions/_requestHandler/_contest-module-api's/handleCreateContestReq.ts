import { createContest } from "../../_repository/_contest-api-repo/CreateContestRepository.ts";
import { ContestModel } from "../../_model/_contestModules/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";

export async function createContext(req: Request):Promise<Response> {
    try {
        // Parsing the request body to get the contest details
        const contestData :ContestModel= await req.json();

        // Check if the request body is empty
        if (Object.keys(contestData).length === 0) {
            console.log("Error: Empty request body.");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: COMMON_ERROR_MESSAGES.EMPTY_REQUEST_BODY,
                error_time: new Date(),
            });
        }

        // Creating a ContestModelImpl instance with the contest data
     

        // Validating the contest details
        const validationErrors = validateContestDetails(contestData);
        console.log("Validation Errors:", validationErrors);

        if (validationErrors instanceof Response) {
            // If there are validation errors, return the response
            return validationErrors;
        }

        contestData.createdat = new Date().toISOString();
        contestData.status = contestData.status?.toLocaleLowerCase();

        const insertedData = await createContest(contestData);

        // Checking if the contest was created successfully
        if (!insertedData || insertedData.length === 0) {
            console.log("Error: Contest not created.");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                error_message: CONTEST_MODULE_ERROR_MESSAGES.CONTEST_NOT_CREATED,
                error_time: new Date(),
            });
        }

        // Returning success response with created contest data
        return handleAllSuccessResponse(
            CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_CREATED,
            insertedData,
            HTTP_STATUS_CODE.CREATED,
        );
        
    } catch (error) {
        // handling internal errors
        console.error("Unexpected Error:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message:
                `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR}, ${error}`,
            error_time: new Date(),
        });
    }
}
