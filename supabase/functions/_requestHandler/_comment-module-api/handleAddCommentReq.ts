import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { addComment, checkUserId, updateCommentsCount } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { checkContentId } from "../../_repository/_comment-api-repo/postCommentRepository.ts";
import { CommentImpl } from "../../_model/CommentModel.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";


export  async function handleAddComment(req:Request) {
  try {
    const {user_id,contentType,contentId,comment}=await req.json();
    
    if(!user_id||!contentType||!contentId||!comment){
        return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Provide All the required fields",error_time:new Date()});
    }
    if (!V4.isValid(user_id)) {
      return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Invalid user_id. Please provide a valid user_id in UUID format.",error_time:new Date()});
    }
    if (!V4.isValid(contentId)) {
      return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Invalid contentId. Please provide a valid contentId in UUID format.",error_time:new Date()});  
    }

    const userData=await checkUserId(user_id);

    if(!userData||userData.length==0){
      return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:"User not found with this id",error_time:new Date()});
     
    }

    const validateContentType=["meme","contest_entry"];

    if(!validateContentType.includes(contentType)){
      return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Invalid content Type only meme or contest_entry allowed",error_time:new Date()});
      
    }

    const contentData=await checkContentId(contentType,contentId);
    if(!contentData||contentData.length==0){
      return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:"content not found with this id",error_time:new Date()});

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
      return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:"Internal server error",error_time:new Date()});
       
    }

    await updateCommentsCount(contentType,commentData);
    
    
    return new Response(JSON.stringify({message:"Comment added successfully",data:postComment}),{status:201,headers:{'content-type':'application/json'}});
  } catch (error) {
    return new Response(JSON.stringify(`Internal Server Error ${error}`),{status:500,headers:{'content-type':'application/json'}});
  }
}
