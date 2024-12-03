import supabase from "../../_shared/_config/DBConnection.ts";

export async function deleteContestById(contest_id:string) {
   try {
    const{data:deletedData,error}=await supabase
    .from('contest')
    .update({status:"deleted"})
    .eq('contest_id',contest_id)
    .neq('status',"deleted").select();

    if(error){
     throw new Error(`Database Error ${error.message}`);
    }
    console.log(deletedData);
    
    return deletedData;
   } catch (error) {
    throw new Error(`Unexpected Error ${error}`);
   }
    
}