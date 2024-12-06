import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { addComment } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { Comment } from "../../_model/_commentModules/CommentModel.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateCommentDetails } from "../../_validation/_commentModuleValidation/ValidateCommentsInfo.ts";
import { COMMENT_MODULE_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { COMMENT_MODULE_SUCCESS_MESSAGES } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { checkUserId } from "../../_repository/_user-api-repo/CheckUserIsPresent.ts";
import { checkContentId } from "../../_repository/_meme-api-repo/CheckMemeId.ts";
import { updateCommentsCount } from "../../_repository/_meme-api-repo/UpdateCommentCount.ts";
import { handleAllSuccessResponse } from "../../_successHandler/CommonSuccessResponse.ts";

export async function handleAddComment(req: Request){
  try {
    // Parsing request body to extract necessary fields
    const { user_id, contentType, contentId, comment } = await req.json();
    console.log(`Received comment request: user_id=${user_id}, contentType=${contentType}, contentId=${contentId}, comment=${comment}`);

    // Validating the comment details
    const validationErrors = validateCommentDetails({ user_id, contentType, contentId, comment });
    if (validationErrors instanceof Response) {
      console.log("Validation failed: ", validationErrors);
      return validationErrors;
    }

    // Checking if the user exists in the database
    const userData = await checkUserId(user_id);
    if (!userData || userData.length === 0) {
      console.log(`User with ID ${user_id} not found.`);
      return handleAllErrors({
        status_code: HTTP_STATUS_CODE.NOT_FOUND,
        error_message: COMMENT_MODULE_ERROR_MESSAGES.USER_NOT_FOUND,
        error_time: new Date(),
      });
    }

    // Checking if the content (meme) exists in the database
    const contentData = await checkContentId(contentId);
    if (!contentData || contentData.length === 0) {
      console.log(`Content with ID ${contentId} not found.`);
      return handleAllErrors({
        status_code: HTTP_STATUS_CODE.NOT_FOUND,
        error_message: COMMENT_MODULE_ERROR_MESSAGES.CONTENT_NOT_FOUND,
        error_time: new Date(),
      });
    }

    // Creating comment object to store in the database
    const commentData: Comment = {
      memeid: contentId,
      userid: user_id,
      commentmessage: comment,
      createdat: new Date(),
      status: "Active",
    };
    console.log(`Creating comment for meme_id ${contentId} by user_id ${user_id}: ${comment}`);

    // Adding the comment to the comment table in the database
    const postComment = await addComment(commentData);
    if (!postComment || postComment.length === 0) {
      console.log("Failed to add comment to the database.");
      return handleAllErrors({
        status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        error_message: COMMENT_MODULE_ERROR_MESSAGES.FAILED_TO_ADD_COMMENT,
        error_time: new Date(),
      });
    }

    // // Fetching the current comment count for the content (meme)
    // const commentCount = await getCommentCount(commentData.meme_id);
    // if (!commentCount) {
    //   console.log("Failed to retrieve current comment count for meme.");
    //   throw new Error(COMMENT_MODULE_ERROR_MESSAGES.FAILED_TO_RETRIEVE_COMMENT_COUNT);
    // }

    // Updating the comment count in the meme table after adding the new comment
    await updateCommentsCount(commentData.memeid, contentData[0].comment_count + 1);
    console.log(`Updated comment count for meme_id ${commentData.memeid}: ${contentData[0].comment_count + 1}`);

    // Sending a successful response with the added comment details

    return handleAllSuccessResponse(COMMENT_MODULE_SUCCESS_MESSAGES.COMMENT_ADDED,postComment,HTTP_STATUS_CODE.CREATED);
     

  } catch (error) {
    // Handling any errors that occur during the comment adding process
    console.error("Error occurred while adding comment:", error);
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
      error_time: new Date(),
    });
  }
}
