import supabase from "../../_shared/_config/DBConnection.ts";

//check if user already falged
export async function userAlreadyFlag(user_id:string) {
    
    try {
        const{data:flagData,error}=await supabase
          .from('flag')
          .select('*')
          .eq('user_id',user_id);

          if(error)
            throw new Error(`DataBase error ${error}`);

          return flagData;

    } catch (error) {
        throw new Error(`${error}`);
    }
            
}