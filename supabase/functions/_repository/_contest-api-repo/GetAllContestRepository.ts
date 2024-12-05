import supabase from "../../_shared/_config/DBConnection.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function getAllContestDetails() {
    
      try {
        const{data:contestData,error}=await supabase
        .from('contest')
        .select('contest_title, description, start_date, end_date, status, prize')
        .neq('status',"deleted");  

        if(error){
          throw new Error(`${CommonErrorMessages.DataBaseError} ${error}`);
        }

        return contestData;
      } catch (error) {
        throw new Error(`${error}`);
      }
  
}