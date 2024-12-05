import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//getting comment count by meme id
export async function  getCommentCount(meme_id:string) {
    try {
     const { data, error } = await supabase
     .from('memes')
     .select('comment_count')
     .eq('meme_id', meme_id)
     .single(); 

      // If there is an error, throw an exception with the error message
     if (error) {
        throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
     }

    return data; 
    } catch (error) {
       throw new Error(`${error}`);
    }
}