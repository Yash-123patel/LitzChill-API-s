import supabase from "../../_shared/_config/DBConnection.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

//deleting existing contest by its id
export async function deleteContestById(contest_id:string) {
   try {
    const{data:deletedData,error}=await supabase
    .from('contest')
    .update({status:"deleted"})
    .eq('contest_id',contest_id)
    .neq('status',"deleted").select();

    if(error){
     throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
    }
    console.log(deletedData);
    
    return deletedData;
   } catch (error) {
    throw new Error(`${error}`);
   }
    
}