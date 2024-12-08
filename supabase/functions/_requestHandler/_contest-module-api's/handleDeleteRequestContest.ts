import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { CONTEST_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CONTEST_VALIDATION_MESSAGES } from "../../_shared/_commonValidationMessages/ValidationMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { deleteContestById } from "../../_QueriesAndTabledDetails/ContestModuleQueries.ts";


export async function handleDeleteContest(req: Request,params: string) {
   try {
     
      console.log("contest id",params);
      const contest_id =params;

      // Validate contest ID
      if (!contest_id || !V4.isValid(contest_id)) {
         console.log("Error: Invalid or missing contest ID.");
         return handleAllErrors({
            status_code: HTTP_STATUS_CODE.BAD_REQUEST,
            error_message: CONTEST_VALIDATION_MESSAGES.INVALID_CONTEST_ID,
            error_time: new Date(),
         });
      }

      // Attempt to delete the contest by id
      const {deletedData,error} = await deleteContestById(contest_id);

       //returning error response if any database error come
      if(error){
         console.log("Database error during deleting contest data",error);
         return handleDatabaseError(error.message);
      }

      // If the contest not found or already deleted
      if (!deletedData || deletedData.length == 0) {
         console.log("Error: Contest not found or already deleted.");
         return handleAllErrors({
            status_code: HTTP_STATUS_CODE.NOT_FOUND,
            error_message: CONTEST_MODULE_ERROR_MESSAGES.CONTEST_NOT_FOUND_OR_DELETED,
            error_time: new Date(),
         });
      }

      // Success response if contest deletion is successful
      console.log("Returning contest deleted success response")
      return  handleAllSuccessResponse(CONTEST_MODULE_SUCCESS_MESSAGES.CONTEST_DELETED);

   } catch (error) {
      //handle internal server
      console.error("Internal server erorr during deleting contest operation:", error);
      return handleAllErrors({
         status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
         error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
         error_time: new Date(),
      });
   }
}
