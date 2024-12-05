import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";


export async function checkCommentId(comment_id: string) {
     try {
        const { data: commentData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('comment_id', comment_id)
        .select(); 

        if (error) {
        throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`)
        }

        if(!commentData||commentData.length==0){
            return [];
        }
       return commentData ;
     } catch (error) {
        throw new Error(`${error}`);
        
     }
}

export async function deleteComment(comment_id:string) {
     try {
        const { data, error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('comment_id', comment_id).select();

        if (deleteError) {
        throw new Error(`${CommonErrorMessages.DataBaseError} ${deleteError.message}`);
        }

        console.log(data);
        return data;
     } catch (error) {
        throw new Error(`${error}`);
     }
}
