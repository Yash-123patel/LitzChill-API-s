import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { checkCommentId, deleteComment } from "../../_repository/_comment-api-repo/deletecomment.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";

import { Comment } from "../../_model/_commentModules/CommentModel.ts";
import { COMMENT_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMENT_MODULE_ERROR_MESSAGES, COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { getCommentCount } from "../../_repository/_meme-api-repo/getCommentCount.ts";
import { updateCommentsCount } from "../../_repository/_meme-api-repo/UpdateCommentCount.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";

export async function handleDeleteComment(req: Request){
    try {
        // Extracting commentId from the URL path
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const commentId = path[path.length - 1];

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
        const dataFromRepo = await checkCommentId(commentId);
        if (!dataFromRepo || dataFromRepo.length === 0) {
            console.log(`Error: Comment with ID ${commentId} not found.`);
            return handleAllErrors({
                status_code: HTTP_STATUS_CODE.NOT_FOUND,
                error_message: COMMENT_MODULE_ERROR_MESSAGES.COMMENT_NOT_FOUND,
                error_time: new Date(),
            });
        }

        // Preparing the comment data object
        const commentData: Comment = {
            comment_id: dataFromRepo[0].comment_id,
            meme_id: dataFromRepo[0].meme_id,
            user_id: dataFromRepo[0].user_id,
            comment: dataFromRepo[0].comment,
            status: dataFromRepo[0].status,
            created_at: dataFromRepo[0].created_at,
        };

        // Fetching the current comment count for the meme associated with the comment
        const commentCount = await getCommentCount(commentData.meme_id);
        if (!commentCount) {
            console.log("Error: Failed to retrieve current comment count.");
            throw new Error(COMMENT_MODULE_ERROR_MESSAGES.FAILED_TO_RETRIEVE_COMMENT_COUNT);
        }

        // Deleting the comment from the database
        await deleteComment(commentId);
        console.log(`Comment with ID ${commentId} successfully deleted.`);

        // Updating the comment count in the meme table
        await updateCommentsCount(commentData.meme_id, commentCount.comment_count - 1);
        console.log(`Updated comment count for meme_id ${commentData.meme_id}: ${commentCount.comment_count - 1}`);

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
