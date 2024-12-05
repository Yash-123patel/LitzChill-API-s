import supabase from "../../_shared/_config/DBConnection.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function getUserTypeFromUsers(userId: string) {
    try {
        console.log(`Fetching user type for user_id: ${userId}`);
        
        // Querying the database to get the user type from the 'users' table
        const { data: user_id, error } = await supabase
            .from('users')
            .select('user_type')
            .eq('user_id', userId);

        // If there is an error, throw an exception with the error message
        if (error) {
            console.error(`Database query error: ${error.message}`);
            throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
        }

        console.log(`User type retrieved: ${user_id ? user_id[0]?.user_type : 'Not Found'}`);
        
        return user_id;

    } catch (error) {
        // Catching any errors 
        console.error(`Error in getUserTypeFromUsers: ${error}`);
        throw new Error(`${error}`);
    }
}
