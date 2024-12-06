import supabase from "../../_shared/_config/DBConnection.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { TABLE_NAMES } from "../../_shared/_QueriesAndTabledDetails/TableNames.ts";

//getting all contests which is not deleted
export async function getAllContestDetails() {
    
      try {
        const{data:contestData,error}=await supabase
        .from(TABLE_NAMES.CONTEST_TABLE)
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