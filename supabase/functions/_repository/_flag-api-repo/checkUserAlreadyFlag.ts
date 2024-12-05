import supabase from "../../_shared/_config/DBConnection.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
//check if user already added falged
export async function userAlreadyFlag(user_id:string) {
    
    try {
        const{data:flagData,error}=await supabase
          .from('flag')
          .select('*')
          .eq('user_id',user_id);

          // If there is an error, throw an exception with the error message
          if(error)
            throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error}`);

          return flagData;

    } catch (error) {
        throw new Error(`${error}`);
    }
            
}