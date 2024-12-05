import supabase from "../../_shared/_config/DBConnection.ts";
import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";


export async function createContest(contest:ContestModelImpl) {
   
   try {
    const{data:insertedData,error}=await supabase
    .from('contest')
    .insert(contest).select();

    if(error){
        throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
    }
    return insertedData;
   } catch (error) {
    throw new Error(`${error}`);
   }

}