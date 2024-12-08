import { handleAllErrors, handleDatabaseError } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { COMMENT_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMENT_MODULE_ERROR_MESSAGES, COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";
import { deleteComment, getCommentById } from "../../_QueriesAndTabledDetails/CommentModuleQueries.ts";
import { updateCommentsCount } from "../../_QueriesAndTabledDetails/MemeModuleQueries.ts";

export async function handleDeleteComment(req: Request,param:string){
    try {
        
        const commentId = param;

        // Checking if commentId is provided
        if (!commentId) {
            console.log("Error: Missing commentId in the request.");
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.MISSING_COMMENT_ID,
                error_time: new Date(),
            });
        }

        // Validating if the commentId is a valid UUID
        if (!V4.isValid(commentId)) {
            console.log(`Error: Invalid commentId format - ${commentId}`);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.BAD_REQUEST,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.INVALID_COMMENT_ID,
                error_time: new Date(),
            });
        }

        // Checking if the comment exists in the database 
        const {commentData,commenterror} = await getCommentById(commentId);

       //returning error response if any database error come
        if(commenterror){
            console.log("Database error during getting comment data",commenterror);
            return handleDatabaseError(commenterror.message);
        }
     
        if (!commentData || commentData.length === 0) {
            console.log(`Error: Comment with ID ${commentId} not found.`);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.COMMENT_NOT_FOUND,
                error_time: new Date(),
            });
        }

        const commentCountOnMeme = commentData[0].memes.comment_count;

        console.log("CommentData"+commentData);
        console.log("Valued",Object.values(commentData));
        console.log("Key",Object.keys(commentData));
       
        // Deleting the comment from the database
        const {error}=await deleteComment(commentId);

        //returning error response if any database error come
       if(error){
          console.log("Database error during deleting  comment",commenterror);
          return handleDatabaseError(error.message);
       }

        // Updating the comment count in the meme table
       const {counterror} =await updateCommentsCount(commentData[0].meme_id,commentCountOnMeme-1);
       if(counterror)
            return handleDatabaseError(counterror.message);

        // Sending a successful response after deletion
       return handleAllSuccessResponse(COMMENT_MODULE_SUCCESS_MESSAGES.COMMENT_DELETED);
        
    } catch (error) {
        // handling any errors during the delete process
        console.error("Error handling delete comment:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            error_time: new Date(),
        });
    }
}
