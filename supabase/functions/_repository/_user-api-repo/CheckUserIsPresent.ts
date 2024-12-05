import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//checking user id is present or not
export async function checkUserId(user_Id: string) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_Id);

      if (error) {
        throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
      }

        console.log("user", JSON.stringify(userData)); 
        return userData;

        
    } catch (error) {
      throw new Error(`${error}`);
    }
}