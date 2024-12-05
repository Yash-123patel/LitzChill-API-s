
import { Comment } from "../../_model/_commentModules/CommentModel.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//inserting comment into comment table
export async function addComment(commentData: Comment) {
    try {
      const { data: postComment, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select();
  
      if (error) {
        throw new Error(`${CommonErrorMessages.DataBaseError}: ${error.message}`);
      }  
      return postComment;
    } catch (error) {
      console.error("Unexpected error:", error);
      throw new Error(`${error}`);
    }
  }

    

  