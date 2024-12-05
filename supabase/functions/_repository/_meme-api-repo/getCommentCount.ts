import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

export async function  getCommentCount(meme_id:string) {
    try {
     const { data, error } = await supabase
     .from('memes')
     .select('comment_count')
     .eq('meme_id', meme_id)
     .single(); 
     if (error) {
        throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
     }

    return data; 
    } catch (error) {
       throw new Error(`${error}`);
    }
}