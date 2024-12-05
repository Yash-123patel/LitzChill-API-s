import supabase from "../../_shared/_config/DBConnection.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function deleteContestById(contest_id:string) {
   try {
    const{data:deletedData,error}=await supabase
    .from('contest')
    .update({status:"deleted"})
    .eq('contest_id',contest_id)
    .neq('status',"deleted").select();

    if(error){
     throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
    }
    console.log(deletedData);
    
    return deletedData;
   } catch (error) {
    throw new Error(`${error}`);
   }
    
}