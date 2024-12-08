import { ContestModel } from "../../_model/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { createContest } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";

export async function handleCreateContext(req: Request):Promise<Response> {
    try {
        // Parsing the request body to get the contest details
        const contestData :ContestModel= await req.json();


        // Validating the contest details
        const validationErrors = validateContestDetails(contestData);
        console.log("contest Validation Errors:", validationErrors);

        if (validationErrors instanceof Response) {
            return validationErrors;
        }

        contestData.created_at = new Date().toISOString();
        contestData.status = contestData.status?.toLocaleLowerCase();

        //calling supabase query for creating contest
        const {insertedData,error} = await createContest(contestData);

        //if data not inserted then returning error response
        if(!insertedData || insertedData.length ===0||error){
            console.log("Error: Contest not created.due to some database errro or query error",error);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                error_message: `${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error?.message}`,
                error_time: new Date(),
            });
        }

        // Returning success response with created contest data
        console.log("Returning success response with created contest data",insertedData);
        return handleAllSuccessResponse(
            CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_CREATED,
            insertedData,
            HTTP_STATUS_CODE.CREATED,
        );
        
    } catch (error) {
        // handling internal errors
        console.error("Internal server error in create contest", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message:
                `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR}, ${error}`,
            error_time: new Date(),
        });
    }
}
