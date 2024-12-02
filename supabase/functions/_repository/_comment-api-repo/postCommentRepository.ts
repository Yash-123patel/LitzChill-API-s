

import { CommentImpl } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

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

export async function checkContentId(contentType: string, contentID: string) {
    let memedata;

    if (contentType === "meme") {
        const { data, error } = await supabase
            .from('meme')
            .select('*')
            .eq('meme_id', contentID);

        memedata = data;

        if (error) {
            throw new Error(`Database error ${error.message}`);
        }

        console.log("meme", JSON.stringify(memedata, null, 2)); 

    } else {
        const { data, error } = await supabase
            .from('contest_entry')
            .select('*')
            .eq('meme_id', contentID);

        memedata = data;

        if (error) {
            throw new Error(`Database error ${error.message}`);
        }

        console.log("contest_entry", JSON.stringify(memedata, null, 2)); 
    }

    return memedata;
}

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

export async function  updateCommentsCoun(contentTpe:string,commentData:CommentImpl) {
   
        if(contentTpe==="meme"){
            const { data: commentCount, error } = await supabase
          .from('meme')
          .select('comment_count')
          .eq('meme_id', commentData.meme_id)
          .single(); 
        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }
      
        if (commentCount) {
          const newCommentCount = commentCount.comment_count + 1;
      
          
          const { error: updateError } = await supabase
            .from('meme')
            .update({ comment_count: newCommentCount })
            .eq('meme_id', commentData.meme_id);
      
          if (updateError) {
            throw new Error(`Database error during update: ${updateError.message}`);
          }
        }
      
        }
        else{
            const { data: commentCount, error } = await supabase
          .from('contest_entry')
          .select('comment_count')
          .eq('meme_id', commentData.meme_id)
          .single(); 
        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }
      
        if (commentCount) {
          const newCommentCount = commentCount.comment_count + 1;
      
          
          const { error: updateError } = await supabase
            .from('contest_entry')
            .update({ comment_count: newCommentCount })
            .eq('meme_id', commentData.meme_id);
      
          if (updateError) {
            throw new Error(`Database error during update: ${updateError.message}`);
          }
        }
      }
}
  
  