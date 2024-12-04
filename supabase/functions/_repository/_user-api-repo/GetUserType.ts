
import supabase from "../../_shared/_config/DBConnection.ts";

export async function getUserTypeFromUsers(userId:string) {
    try {
        
        const{data:user_id,error}=await supabase
              .from('users')
              .select('user_type')
              .eq('user_id',userId);

              if(error)
                throw new Error(`Internal server error ${error.message}`);

              return user_id;

    } catch (error) {
        throw new Error(`Internal server error ${error}`);
    }
    
}