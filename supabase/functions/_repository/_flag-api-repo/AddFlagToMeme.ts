import supabase from "../../_shared/_config/DBConnection.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

//inserting flag in database
export async function addFlagToMeme(flag: FlagModel) {
    try {
        const { data: flagData, error } = await supabase
            .from("flag")
            .insert(flag)
            .select();

     // If there is an error, throw an exception with the error message
        if (error) {
            throw new Error(
                `${COMMON_ERROR_MESSAGES.DATABASE_ERROR} ${error.message}`,
            );
        }
        
        return flagData;
        
    } catch (error) {
        throw new Error(`${error}`);
    }
}
