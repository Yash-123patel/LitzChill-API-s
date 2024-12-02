import { handleBadRequestError, handleInternalServerError, handleNotFoundError } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { checkCommentId, deleteComment, getCommentCount } from "../../_repository/_comment-api-repo/deletecomment.ts";
import { CommentImpl } from "../../_model/CommentModel.ts";

export async function handleDeleteComment(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split('/');
        const commentId = path[path.length - 1];

        if (!commentId) {
            return handleBadRequestError("Comment ID is required.");
        }

        if (!V4.isValid(commentId)) {
            return handleBadRequestError("Invalid Comment ID. Please provide a valid UUID.");
        }

     
        const commentData: CommentImpl = await checkCommentId(commentId);
        if (!commentData) { 
            return handleNotFoundError("Comment not found with the provided ID.");
        }
        console.log(commentData.content_type)

        
        const commentCOunt=await getCommentCount(commentData.content_type);
        if(!commentCOunt||commentCOunt==0){

            handleInternalServerError("Internal server error");
        }
       
        const deletedComment=await deleteComment(commentData,commentData.content_type,commentCOunt-1);

        return new Response(JSON.stringify({ message: "Comment deleted successfully"}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error handling delete comment:", error);
        return handleInternalServerError("An unexpected error occurred while processing the request.");
    }
}
