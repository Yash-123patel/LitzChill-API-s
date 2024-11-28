import supabase from "../_shared/_config/DBConnection.ts";
import {ContestModelImpl} from "../_model/ContestModel.ts"

export async function createContest(contest:ContestModelImpl) {
   
    const{data:insertedData,error}=await supabase
            .from('contest')
            .insert(contest).select();

            if(error){
                throw new Error(`Database error ${error.message}`);
            }
            return insertedData;
}