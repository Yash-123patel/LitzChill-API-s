import { CommentImpl } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";


export async function checkCommentId(comment_id: string) {
    const { data: commentData, error } = await supabase
        .from('comment')
        .select('*')
        .eq('comment_id', comment_id)
        .single(); 

    if (error) {
        throw new Error(`Database error: ${error.message}`);
    }
    return commentData ;
}


export async function getCommentCount(contentType: string) {
    const { data: commentCount, error } = await supabase
        .from(contentType)
        .select('comment_count')
        .single(); 

    if (error) {
        throw new Error(`Database error: ${error.message}`);
    }

   
    return commentCount ? commentCount.comment_count : 0;
}


export async function deleteComment(commentData: CommentImpl, contentType: string, newCommentCount: number) {

    const { error: deleteError } = await supabase
        .from('comment')
        .delete()
        .eq('comment_id', commentData.comment_id);

    if (deleteError) {
        throw new Error(`Database error: ${deleteError.message}`);
    }

    console.log(contentType);
    
    const {data:updatedData, error: updateError } = await supabase
        .from(contentType)
        .update({ comment_count: newCommentCount })
        .eq('meme_id', commentData.meme_id).select(); 

    if (updateError) {
        throw new Error(`Database error: ${updateError.message}`);
    }

    console.log(updatedData);
    return updatedData;
}
