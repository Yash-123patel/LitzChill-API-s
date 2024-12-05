import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//updating comment count by meme id
export async function  updateCommentsCount(meme_id:string,newCommentCount:number) {
    try {
     const { error: updateError } = await supabase
     .from('memes')
     .update({ comment_count: newCommentCount })
     .eq('meme_id', meme_id).select();
 
      // If there is an error, throw an exception with the error message
     if (updateError) {
     throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${updateError.message}`);
     }
    } catch (error) {
       throw new Error(`${error}`);
    }
} 