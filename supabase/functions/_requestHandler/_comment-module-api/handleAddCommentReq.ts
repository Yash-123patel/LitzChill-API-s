import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { addComment} from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { Comment } from "../../_model/_commentModules/CommentModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateCommentDetails } from "../../_validation/_commentModuleValidation/ValidateCommentsInfo.ts";
import { CommentModuleErrorMessages } from "../../_shared/_commentModuleMessages/ErrorMessages.ts";
import { CommentModuleSuccessMessages } from "../../_shared/_commentModuleMessages/SuccessMessages.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { checkUserId } from "../../_repository/_user-api-repo/CheckUserIsPresent.ts";
import { checkContentId } from "../../_repository/_meme-api-repo/CheckMemeId.ts";
import { getCommentCount } from "../../_repository/_meme-api-repo/getCommentCount.ts";
import { updateCommentsCount } from "../../_repository/_meme-api-repo/UpdateCommentCount.ts";


export async function handleAddComment(req: Request) {
  try {
    // Parsing request body
    const { user_id, contentType, contentId, comment } = await req.json();

    // Validating comment details
    const validationErrors = validateCommentDetails({ user_id, contentType, contentId, comment });
    if (validationErrors instanceof Response) {
      return validationErrors;
    }

    // Checking if user exists
    const userData = await checkUserId(user_id);
    if (!userData || userData.length === 0) {
      return handleAllErrors({
        status_code: Http_Status_Codes.NOT_FOUND,
        error_message: CommentModuleErrorMessages.UserNotFound,
        error_time: new Date(),
      });
    }

    // Checking if content (meme) exists
    const contentData = await checkContentId(contentId);
    if (!contentData || contentData.length === 0) {
      return handleAllErrors({
        status_code: Http_Status_Codes.NOT_FOUND,
        error_message: CommentModuleErrorMessages.ContentNotFound,
        error_time: new Date(),
      });
    }

    //creating comment object
    const commentData: Comment = {
      meme_id: contentId,
      user_id: user_id,
      comment: comment,
      created_at: new Date(),
      status: "Active",
    };

    // Adding comment into the comment table
    const postComment = await addComment(commentData);
    if (!postComment || postComment.length === 0) {
      return handleAllErrors({
        status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        error_message: CommentModuleErrorMessages.FailedToAddComment,
        error_time: new Date(),
      });
    }

    // Getting current comment count from meme table
    const commentCount = await getCommentCount(commentData.meme_id);
    if (!commentCount) {
      throw new Error(CommentModuleErrorMessages.FailedToRetriveCommentCount);
    }

    // Updating comment count in the meme table
    await updateCommentsCount( commentData.meme_id,commentCount.comment_count + 1);

    
    // Sending successful response
    return new Response(
      JSON.stringify({
        message: CommentModuleSuccessMessages.CommentAdded,
        data: postComment,
      }),
      { status: 201, headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue} },
    );

  } catch (error) {
    
    return handleAllErrors({
      status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
      error_message: `${CommonErrorMessages.InternalServerError} ${error}`,
      error_time: new Date(),
    });
  }
}
