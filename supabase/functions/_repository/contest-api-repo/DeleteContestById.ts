import supabase from "../../_shared/_config/DBConnection.ts";

export async function deleteContestById(contest_id:string) {
   try {
    const{data:deletedData,error}=await supabase
    .from('contest')
    .update({status:"Deleted"})
    .eq('contest_id',contest_id).select();

    if(error){
     throw new Error(`Database Error ${error.message}`);
    }

    if(!deletedData||deletedData.length==0){
     throw new Error("Deletion failed due to some error");
    }

    return deletedData;
   } catch (error) {
    throw new Error(`Unexpected Error ${error}`);
   }
    
}