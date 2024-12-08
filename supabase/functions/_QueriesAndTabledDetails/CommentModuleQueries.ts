import { Comment } from "../_model/CommentModel.ts";
import supabase from "../_shared/_config/DBConnection.ts";
import { TABLE_NAMES } from "./TableNames.ts";

// adding comment into meme
export async function addComment(commentData: Comment) {
      const { data: postComment, error } = await supabase
        .from(TABLE_NAMES.COMMENT_TABLE)
        .insert(commentData)
        .select();

        return {postComment,error};
}
  
//get comment based on id
export async function getCommentById(comment_id:string) {
    const{data:commentData,error:commenterror}=await supabase
       .from(TABLE_NAMES.COMMENT_TABLE)
       .select(`*,memes(comment_count)`)
       .eq('comment_id', comment_id);

      return {commentData,commenterror};

}

//deleting comment from comment table based on comment id
export async function deleteComment(comment_id:string) {
    const {error} = await supabase
       .from(TABLE_NAMES.COMMENT_TABLE)
       .delete()
       .eq('comment_id', comment_id);

       return {error};
      
}
