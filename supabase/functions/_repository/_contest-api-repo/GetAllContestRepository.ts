import supabase from "../../_shared/_config/DBConnection.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

//getting all contests which is not deleted
export async function getAllContestDetails() {
    
      try {
        const{data:contestData,error}=await supabase
        .from('contest')
        .select('contest_title, description, start_date, end_date, status, prize')
        .neq('status',"deleted");  

        if(error){
          throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error}`);
        }

        return contestData;
      } catch (error) {
        throw new Error(`${error}`);
      }
  
}