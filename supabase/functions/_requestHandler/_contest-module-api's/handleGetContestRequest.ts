import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { getContestDetailsById } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";
import { checkPrivillege } from "../../_middleware/CheckAuthorization.ts";
import { USER_ROLES } from "../../_shared/_constant/UserRoles.ts";
import { validateContestId } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";

export async function handlegetContestById(req: Request,params: string) {
    try {

        
        const privillege=  await checkPrivillege(req,[USER_ROLES.ADMIN_ROLE]);

        if(privillege instanceof Response){
             return privillege;
        }

       
        console.log(params);
        const contest_id =params;


        console.log(`Received request to get contest with ID: ${contest_id}`);

        // Validate the contest_id
        const validatedId=validateContestId(contest_id);
        if(validatedId instanceof Response){
            return validatedId;
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
            
        });
    }
}
