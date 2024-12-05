import supabase from "../../_shared/_config/DBConnection.ts";
import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

//updating existing contest by its id where status is not deleted
export async function updateContestById(contestData: Partial<ContestModelImpl>) {
       
    try {
        console.log(contestData.contest_id);
        
        const{data:updatedContest,error}=await supabase
                .from('contest')
                .update(contestData)
                .eq('contest_id', contestData.contest_id)
                .neq('status',"deleted").select();

               if(error){
                throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
               }

               console.log(updatedContest);
               return updatedContest;
    } catch (error) {
        throw new Error(`Internal Server Error ${error}`)
    }
}