import supabase from "../../_shared/_config/DBConnection.ts";
import { FlagModel } from "../../_model/_flagModules/FlagModel.ts";
import { COMMON_ERROR_MESSAGES } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { TABLE_NAMES } from "../../_shared/_QueriesAndTabledDetails/TableNames.ts";

//inserting flag in database
export async function addFlagToMeme(flag: FlagModel) {
    try {
        const { data: flagData, error } = await supabase
            .from(TABLE_NAMES.FLAG_TABLE)
            .insert({'meme_id':flag.contentId,
                     'user_id':flag.user_id,
                     'reason':flag.reason,
                     'created_at':flag.created_at
                    })
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
