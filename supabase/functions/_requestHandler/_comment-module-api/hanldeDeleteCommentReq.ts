import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import {checkCommentId,deleteComment} from "../../_repository/_comment-api-repo/deletecomment.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { Comment } from "../../_model/_commentModules/CommentModel.ts";
import { CommentModuleErrorMessages } from "../../_shared/_commentModuleMessages/ErrorMessages.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { CommentModuleSuccessMessages } from "../../_shared/_commentModuleMessages/SuccessMessages.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { getCommentCount } from "../../_repository/_meme-api-repo/getCommentCount.ts";
import { updateCommentsCount } from "../../_repository/_meme-api-repo/UpdateCommentCount.ts";


export async function handleDeleteComment(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const commentId = path[path.length - 1];

        if (!commentId) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message: CommentModuleErrorMessages.MissingCommentId,
                error_time: new Date(),
            });
        }

        if (!V4.isValid(commentId)) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message:
                    CommentModuleErrorMessages.InvalidCommentId,
                error_time: new Date(),
            });
        }

        const dataFromRepo = await checkCommentId(commentId);
        if (!dataFromRepo||dataFromRepo.length==0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message: CommentModuleErrorMessages.CommentNotFound,
                error_time: new Date(),
            });
        }
        
        const commentData: Comment = {
            comment_id:dataFromRepo[0].comment_id,
            meme_id: dataFromRepo[0].meme_id,
            user_id: dataFromRepo[0].user_id,
            comment: dataFromRepo[0].comment,
            status: dataFromRepo[0].status,
            created_at: dataFromRepo[0].created_at
          };
          


        const commentCount = await getCommentCount(commentData.meme_id);
        if (!commentCount) {
            return handleAllErrors({
                status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
                error_message: CommonErrorMessages.InternalServerError,
                error_time: new Date(),
            });
        }

        await deleteComment(commentId);
        await updateCommentsCount(commentData.meme_id,commentCount.comment_count-1);
        
        return new Response(
            JSON.stringify({ message: CommentModuleSuccessMessages.CommentDeleted }),
            {
                status: 200,
                headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue },
            },
        );
    } catch (error) {
        console.error("Error handling delete comment:", error);
        return handleAllErrors({
            status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            error_message:
                CommonErrorMessages.InternalServerError,
            error_time: new Date(),
        });
    }
}
