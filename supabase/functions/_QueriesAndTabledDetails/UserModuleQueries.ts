import supabase from "../_shared/_config/DBConnection.ts";
import { TABLE_NAMES } from "./TableNames.ts";



//checking user id is present or not
export async function checkUserId(user_Id: string) {
    
      const { data: userData, error:usererror } = await supabase
        .from(TABLE_NAMES.USER_TABLE)
        .select('*')
        .eq('user_id', user_Id);

        return {userData,usererror};  
}

