

import { CommentImpl } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//checking user id is present or not
export async function checkUserId(user_Id: string) {
    const { data: userData, error } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', user_Id);

    if (error) {
        throw new Error(`Database error ${error.message}`);
    }

    if (userData) {
        console.log("user", JSON.stringify(userData, null, 2)); 
    }

    return userData;
}

//checking meme id is present or not either meme or contest-entry table wahtever type user passed
export async function checkContentId(contentType: string, contentID: string) {
        const { data, error } = await supabase
            .from(contentType)
            .select('*')
            .eq('meme_id', contentID);

        if (error) {
            throw new Error(`Database error ${error.message}`);
        }   
    return data;
}

//inserting comment into comment table
export async function addComment(commentData: CommentImpl) {
    try {
      const { data: postComment, error } = await supabase
        .from('comment')
        .insert(commentData)
        .select();
  
      if (error) {
        console.error("Error inserting comment:", error);
        throw new Error(`Database error: ${error.message || 'Unknown error'}`);
      }  
      return postComment;
    } catch (err) {
      console.error("Unexpected error:", err);
      throw new Error(`Unexpected error: ${err || 'Unknown error'}`);
    }
  }

  //updating comment count
export async function  updateCommentsCount(contentTpe:string,commentData:CommentImpl) {
   
  
      const { data: commentCount, error } = await supabase
          .from(contentTpe)
          .select('comment_count')
          .eq('meme_id', commentData.meme_id)
          .single(); 
        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }
      
        if (commentCount) {
          const newCommentCount = commentCount.comment_count + 1;
      
          
          const { error: updateError } = await supabase
            .from(contentTpe)
            .update({ comment_count: newCommentCount })
            .eq('meme_id', commentData.meme_id);
      
          if (updateError) {
            throw new Error(`Database error during update: ${updateError.message}`);
          }
        } 
        
}
  
  