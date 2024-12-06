import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";
import { TABLE_NAMES } from "../../_shared/_QueriesAndTabledDetails/TableNames.ts";

//checking user id is present or not
export async function checkUserId(user_Id: string) {
    try {
      const { data: userData, error } = await supabase
        .from(TABLE_NAMES.USER_TABLE)
        .select('*')
        .eq('user_id', user_Id);

       // If there is an error, throw an exception with the error message
      if (error) {
        throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
      }

        console.log("user", JSON.stringify(userData)); 
        return userData;

        
    } catch (error) {
      throw new Error(`${error}`);
    }
}