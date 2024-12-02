import { handleBadRequestError, handleInternalServerError, handleNotFoundError } from "../../_errorHandler/ErrorsHandler.ts";
import { addComment, checkUserId, updateCommentsCoun } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { checkContentId } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { CommentImpl } from "../../_model/CommentModel.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";


export  async function handleAddComment(req:Request) {
  try {
    const {user_id,contentType,contentId,comment}=await req.json();
    
    if(!user_id||!contentType||!contentId||!comment){
        return handleBadRequestError("Provide All the required fields");
    }
    if (!V4.isValid(user_id)) {
        return handleBadRequestError("Invalid user_id. Please provide a valid user_id in UUID format.");
    }
    if (!contentId || !V4.isValid(contentId)) {
        return handleBadRequestError("Invalid contentId. Please provide a valid contentId in UUID format.");
    }

    const userData=await checkUserId(user_id);

    if(!userData||userData.length==0){
        return handleNotFoundError("User not found with this id");
    }

    const validateContentType=["meme","contest_entry"];

    if(!validateContentType.includes(contentType)){
       return handleBadRequestError("Invalid content Type only meme or contest_entry allowed")
    }

    const contentData=await checkContentId(contentType,contentId);
    if(!contentData||contentData.length==0){
        return handleNotFoundError("content not found with this id");
    }

    const commentData = new CommentImpl({
        meme_id: contentId,
        user_id: user_id,
        comment: comment,
        status: 'Active',
        content_type:contentType
      });
    const postComment=await addComment(commentData);
    if(!postComment||postComment.length==0){
        return handleInternalServerError("Internal server error");
    }

    const updatedCount=await updateCommentsCoun(contentType,commentData);
    
    return new Response(JSON.stringify({message:"Comment added successfully",data:postComment}),{status:201,headers:{'content-type':'application/json'}});
  } catch (error) {
    return new Response(JSON.stringify(`Internal Server Error ${error}`),{status:500,headers:{'content-type':'application/json'}});
  }
}
