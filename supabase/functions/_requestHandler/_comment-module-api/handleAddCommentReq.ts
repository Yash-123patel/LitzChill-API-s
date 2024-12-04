import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { addComment, checkUserId} from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { checkContentId } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { Comment } from "../../_model/CommentModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateCommentDetails } from "../../_validation/_commentModuleValidation/ValidateCommentsInfo.ts";
import { getCommentCount, updateCommentsCount } from "../../_repository/_comment-api-repo/getCommentCount.ts";

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
        error_message: "User not found with this id",
        error_time: new Date(),
      });
    }

    // Checking if content (meme) exists
    const contentData = await checkContentId(contentId);
    if (!contentData || contentData.length === 0) {
      return handleAllErrors({
        status_code: Http_Status_Codes.NOT_FOUND,
        error_message: "Content not found with this id",
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
        error_message: "Failed to add comment. Internal server error",
        error_time: new Date(),
      });
    }

    // Getting current comment count from meme table
    const commentCount = await getCommentCount(commentData.meme_id);
    if (!commentCount) {
      throw new Error("Failed to retrieve comment count. Internal server error");
    }

    // Updating comment count in the meme table
    await updateCommentsCount( commentData.meme_id,commentCount.comment_count + 1);

    
    // Sending successful response
    return new Response(
      JSON.stringify({
        message: "Comment added successfully",
        data: postComment,
      }),
      { status: 201, headers: { "content-type": "application/json" } },
    );

  } catch (error) {
    
    return handleAllErrors({
      status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
      error_message: `Internal server error: ${error}`,
      error_time: new Date(),
    });
  }
}
