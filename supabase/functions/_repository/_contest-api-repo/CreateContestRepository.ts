import supabase from "../../_shared/_config/DBConnection.ts";
import { ContestModel } from "../../_model/_contestModules/ContestModel.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { TABLE_NAMES } from "../../_shared/_QueriesAndTabledDetails/TableNames.ts";
//creating new contest
export async function createContest(contest:ContestModel) {
   
   try {
    const{data:insertedData,error}=await supabase
    .from(TABLE_NAMES.CONTEST_TABLE)
    .insert(contest).select();

    if(error){
        throw new Error(`${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`);
    }
    return insertedData;
   } catch (error) {
    throw new Error(`${error}`);
   }

}