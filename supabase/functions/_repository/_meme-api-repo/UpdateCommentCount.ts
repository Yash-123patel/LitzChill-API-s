import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//updating comment count
export async function  updateCommentsCount(meme_id:string,newCommentCount:number) {
    try {
     const { error: updateError } = await supabase
     .from('memes')
     .update({ comment_count: newCommentCount })
     .eq('meme_id', meme_id).select();
 
     if (updateError) {
     throw new Error(`${CommonErrorMessages.DataBaseError} ${updateError.message}`);
     }
    } catch (error) {
       throw new Error(`${error}`);
    }
} 