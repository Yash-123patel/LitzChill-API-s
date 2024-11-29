import supabase from "../_shared/_config/DBConnection.ts";
import { ContestModelImpl } from "../_model/ContestModel.ts";

export async function updateContestById(contestData: Partial<ContestModelImpl>) {
       
    try {
        console.log(contestData.contest_id);
        
        const{data:updatedContest,error}=await supabase
                .from('contest')
                .update(contestData)
                .eq('contest_id', contestData.contest_id).select();

               if(error){
                throw new Error(`Database Error ${error.message}`);
               }

               console.log(updatedContest);
               return updatedContest;
    } catch (error) {
        throw new Error(`Internal Server Error ${error}`)
    }
}