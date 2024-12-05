import supabase from "../../_shared/_config/DBConnection.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function addFlagToMeme(flag: FlagModel) {
    try {
        const { data: flagData, error } = await supabase
            .from("flag")
            .insert(flag)
            .select();

        if (error) {
            throw new Error(
                `${CommonErrorMessages.DataBaseError} ${error.message}`,
            );
        }
        
        return flagData;
        
    } catch (error) {
        throw new Error(`${error}`);
    }
}
