import { Comment } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";


export async function checkCommentId(comment_id: string) {
    const { data: commentData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('comment_id', comment_id)
        .single(); 

    if (error) {
        throw new Error(`Database error: ${error.message}`)
    }
    return commentData ;
}

export async function deleteComment(comment_id:string) {
    const { data, error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('comment_id', comment_id).select();

    if (deleteError) {
        throw new Error(`Database error: ${deleteError.message}`);
    }

    console.log(data);
    return data;
}
