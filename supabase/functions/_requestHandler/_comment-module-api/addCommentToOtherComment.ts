import {
   handleAllErrors,
   handleDatabaseError,
} from "../../_errorHandler/ErrorsHandler.ts";
import { Comment } from "../../_model/CommentModel.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateCommentDetails, validateCommentId } from "../../_validation/_commentModuleValidation/ValidateCommentsInfo.ts";
import { COMMENT_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { COMMENT_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import {
   addComment,
   getCommentById,
} from "../../_QueriesAndTabledDetails/CommentModuleQueries.ts";
import { checkUserId } from "../../_QueriesAndTabledDetails/UserModuleQueries.ts";
import {
   checkContentId,
   updateCommentsCount,
} from "../../_QueriesAndTabledDetails/MemeModuleQueries.ts";
import { checkPrivillege } from "../../_middleware/CheckAuthorization.ts";
import { USER_ROLES } from "../../_shared/_constant/UserRoles.ts";


export async function handleAddCommentToOtherComment(req: Request, param: string) {
   try {
     const userprivillege= await checkPrivillege(req, [
         USER_ROLES.ADMIN_ROLE,
         USER_ROLES.USER_ROLE,
      ]);

      if(userprivillege instanceof Response){
          return userprivillege;
      }

     

      const commentId = param;
   
      const validatedId=validateCommentId(commentId);

      if(validatedId instanceof Response){
         return validatedId;
     }


      // Checking if the comment exists in the database
      const { commentData, commenterror } = await getCommentById(commentId);

      if(commenterror){
         console.log("Database error during getting comment data",commenterror);
         return handleDatabaseError(commenterror.message);
     }
  
     if (!commentData || commentData.length === 0) {
         console.log(`Error: Comment with ID ${commentId} not found.`);
         return handleAllErrors({
             status_code: HTTP_STATUS_CODE.NOT_FOUND,
             error_message: COMMENT_MODULE_ERROR_MESSAGES.COMMENT_NOT_FOUND,
           
         });
     }


      const { user_id, contentType, meme_id, comment } = await req.json();
      const validationErrors = validateCommentDetails({
         user_id,
         contentType,
         meme_id,
         comment,
      });
      if (validationErrors instanceof Response) {
         console.log("Validation failed: ", validationErrors);
         return validationErrors;
      }

      // Checking if the user exists in the database
      const { userData, usererror } = await checkUserId(user_id);

      if (usererror) {
         return handleDatabaseError(usererror.message);
      }

      if (!userData || userData.length === 0) {
         console.log(`User with ID ${user_id} not found.`);
         return handleAllErrors({
            status_code: HTTP_STATUS_CODE.NOT_FOUND,
            error_message: COMMENT_MODULE_ERROR_MESSAGES.USER_NOT_FOUND,
           
         });
      }

      // Checking if the content (meme) exists in the database
      const { memeData, memeError } = await checkContentId(meme_id);

      if (memeError) {
         return handleDatabaseError(memeError.message);
      }

      if (!memeData || memeData.length === 0) {
         console.log(`Content with ID ${meme_id} not found.`);
         return handleAllErrors({
            status_code: HTTP_STATUS_CODE.NOT_FOUND,
            error_message: COMMENT_MODULE_ERROR_MESSAGES.CONTENT_NOT_FOUND,
          
         });
      }

      // Creating comment object to store in the database
      const commentDetails: Comment = {
         meme_id: meme_id,
         user_id: user_id,
         comment: comment,
         created_at: new Date(),
         status: "Active",
         parent_commentId:commentId
      };
      console.log(
         `Creating comment for meme_id ${meme_id} by user_id ${user_id}: ${comment}`,
      );

      // Adding the comment to the comment table in the database
      const { postComment, error } = await addComment(commentDetails);
        //returning error response if any database error come
        if(error){
         return handleDatabaseError(error.message);
       }

   if (!postComment || postComment.length === 0) {
     console.log("Failed to add comment to the database.");
     return handleAllErrors({
        status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        error_message: COMMENT_MODULE_ERROR_MESSAGES.FAILED_TO_ADD_COMMENT,
       
     });
   }

   // Updating the comment count in the meme table after adding the new comment
    const{counterror}=  await updateCommentsCount(commentDetails.meme_id, memeData[0].comment_count+1);
    console.log(`Updated comment count for meme_id ${commentDetails.meme_id}: ${memeData[0].comment_count + 1}`);

   if(counterror)
       return handleDatabaseError(counterror.message);

   // Sending a successful response with the added comment details

    return handleAllSuccessResponse(COMMENT_MODULE_SUCCESS_MESSAGES.COMMENT_ADDED,postComment,HTTP_STATUS_CODE.CREATED);
    
   } catch (error) {
      // Handling any errors that occur during the comment adding process
      console.error("Error occurred while adding comment:", error);
      return handleAllErrors({
         status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
         error_message:
            `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
        
      });
   }
}
