import { handleAllErrors} from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { checkCommentId, deleteComment, getCommentCount } from "../../_repository/_comment-api-repo/deletecomment.ts";
import { CommentImpl } from "../../_model/CommentModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";

export async function handleDeleteComment(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split('/');
        const commentId = path[path.length - 1];

        if (!commentId) {
            return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Comment ID is required.",error_time:new Date()});
           
        }

        if (!V4.isValid(commentId)) {
            return handleAllErrors({status_code:Http_Status_Codes.BAD_REQUEST,error_message:"Invalid Comment ID. Please provide a valid UUID.",error_time:new Date()});
           
        }

     
        const commentData: CommentImpl = await checkCommentId(commentId);
        if (!commentData) { 
            return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:"Comment not found with the provided ID.",error_time:new Date()});
           
        }
        console.log(commentData.content_type)

        
        const commentCOunt=await getCommentCount(commentData.content_type);
        if(!commentCOunt||commentCOunt==0){
            return handleAllErrors({status_code:Http_Status_Codes.INTERNAL_SERVER_ERROR,error_message:"Internal server error",error_time:new Date()});
        }
       
        await deleteComment(commentData,commentData.content_type,commentCOunt-1);

        return new Response(JSON.stringify({ message: "Comment deleted successfully"}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error handling delete comment:", error);
        return handleAllErrors({status_code:Http_Status_Codes.INTERNAL_SERVER_ERROR,error_message:"An unexpected error occurred while processing the request.",error_time:new Date()});
    }
}
