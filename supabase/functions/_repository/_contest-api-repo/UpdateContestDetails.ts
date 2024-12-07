import supabase from "../../_shared/_config/DBConnection.ts";
import { ContestModel} from "../../_model/_contestModules/ContestModel.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { TABLE_NAMES } from "../../_shared/_QueriesAndTabledDetails/TableNames.ts";

//updating existing contest by its id where status is not deleted
export async function updateContestById(contestData: Partial<ContestModel>) {
       
    try {
        console.log(contestData.contest_id);
        
        const{data:updatedContest,error}=await supabase
                .from(TABLE_NAMES.CONTEST_TABLE)
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