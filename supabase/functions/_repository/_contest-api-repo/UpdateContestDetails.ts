import supabase from "../../_shared/_config/DBConnection.ts";
import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function updateContestById(contestData: Partial<ContestModelImpl>) {
       
    try {
        console.log(contestData.contest_id);
        
        const{data:updatedContest,error}=await supabase
                .from('contest')
                .update(contestData)
                .eq('contest_id', contestData.contest_id)
                .neq('status',"deleted").select();

               if(error){
                throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
               }

               console.log(updatedContest);
               return updatedContest;
    } catch (error) {
        throw new Error(`Internal Server Error ${error}`)
    }
}