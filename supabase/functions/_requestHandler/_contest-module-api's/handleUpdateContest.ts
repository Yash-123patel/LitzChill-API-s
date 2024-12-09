import { ContestModel } from "../../_model/ContestModel.ts";
import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestId, validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { updateContestById } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";
import { USER_ROLES } from "../../_shared/_constant/UserRoles.ts";
import { checkPrivillege } from "../../_middleware/CheckAuthorization.ts";

export async function handleupdateContestDetails(req: Request,params: string) {
    try {
        
        //checking user authorization
       const privillege= await checkPrivillege(req,[USER_ROLES.ADMIN_ROLE]);
        if(privillege instanceof Response){
           return privillege;
        }


        const contest_id =params;

        console.log(`Received request to update contest with ID: ${contest_id}`);

        // Validate the contest_id
      const validatedId=  validateContestId(contest_id);
      if(validatedId instanceof Response){
        return validatedId;
    }

        // Get contest details from the request body
        const contestDetails: Partial<ContestModel> = await req.json();
        console.log("Received contest details for update:", contestDetails);

        // Validate the contest details
        validateContestDetails(contestDetails, true);
        
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
           
        });
    }
}
