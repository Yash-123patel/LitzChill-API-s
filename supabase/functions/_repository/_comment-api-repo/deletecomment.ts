import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

// Check if a comment exists by its ID
export async function checkCommentId(comment_id: string) {
     try {
        // Query to check comment by comment_id
        const { data: commentData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('comment_id', comment_id)
        .select(); 

        // Handle database error
        if (error) {
            throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
        }
        // Return empty array if no data is found
        if (!commentData || commentData.length == 0) {
            return [];
        }
        return commentData ;
     } catch (error) {

        throw new Error(`${error}`);
     }
}

// Delete a comment by its ID
export async function deleteComment(comment_id: string) {
     try {
        // Query to delete the comment by comment_id
        const { data, error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('comment_id', comment_id).select();

        // Handle deletion error
        if (deleteError) {
            throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${deleteError.message}`);
        }

        console.log(data);

        return data;
     } catch (error) {
        throw new Error(`${error}`);
     }
}
