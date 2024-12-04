

import { Comment } from "../../_model/CommentModel.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//checking user id is present or not
export async function checkUserId(user_Id: string) {
    const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_Id);

      if (error) {
        throw new Error(`Database error ${error.message}`);
      }
        console.log("user", JSON.stringify(userData)); 
        return userData;
}

//checking meme id is present or not
export async function checkContentId(contentID: string) {
        const { data, error } = await supabase
            .from('memes')
            .select('*')
            .eq('meme_id', contentID);

        if (error) {
            throw new Error(`Database error ${error.message}`);
        }   
        console.log("user", JSON.stringify(data)); 
    return data;
}

//inserting comment into comment table
export async function addComment(commentData: Comment) {
    try {
      const { data: postComment, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select();
  
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }  
      return postComment;
    } catch (err) {
      console.error("Unexpected error:", err);
      throw new Error(`Unexpected error: ${err}`);
    }
  }

    

  