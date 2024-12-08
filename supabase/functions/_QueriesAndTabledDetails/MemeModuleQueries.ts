import supabase from "../_shared/_config/DBConnection.ts";
import { TABLE_NAMES } from "./TableNames.ts";

//checking meme id is present or not
export async function checkContentId(contentID: string) {
    
      const { data:memeData, error:memeError } = await supabase
        .from(TABLE_NAMES.MEME_TABLE)
        .select('*')
        .eq('meme_id', contentID);

        return {memeData,memeError};
}

//updating comment count
export async function  updateCommentsCount(meme_id:string,newCommentCount:number) {
 
     const {error: counterror } = await supabase
     .from(TABLE_NAMES.MEME_TABLE)
     .update({ comment_count: newCommentCount })
     .eq('meme_id', meme_id);
 
      return {counterror};
} 

//updating flag count

export async function  updateFlagCount(meme_id:string,newCommentCount:number) {
    
     const { error: countError } = await supabase
     .from(TABLE_NAMES.MEME_TABLE)
     .update({ flag_count: newCommentCount })
     .eq('meme_id', meme_id);
      
     return {countError};
} 