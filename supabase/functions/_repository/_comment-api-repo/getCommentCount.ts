import { Comment } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//getting comment count from meme table.
export async function  getCommentCount(meme_id:string) {
    const { data, error } = await supabase
        .from('memes')
        .select('comment_count')
        .eq('meme_id', meme_id)
        .single(); 
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

    return data; 
}

 //updating comment count
 export async function  updateCommentsCount(meme_id:string,newCommentCount:number) {
  const { error: updateError } = await supabase
    .from('memes')
    .update({ comment_count: newCommentCount })
    .eq('meme_id', meme_id).select();

  if (updateError) {
    throw new Error(`Database error during update: ${updateError.message}`);
  }
} 