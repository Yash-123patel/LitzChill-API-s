import { FlagModel } from "../_model/FlagModel.ts";
import supabase from "../_shared/_config/DBConnection.ts";
import { TABLE_NAMES } from "./TableNames.ts";

//check if user already added flag to meme
export async function chekUserAlreadyFlag(user_id:string,meme_id:string) {
    
        const{data:userflagData,error:flagerror}=await supabase
          .from(TABLE_NAMES.FLAG_TABLE)
          .select('*')
          .eq('user_id',user_id)
          .eq('meme_id',meme_id);

        return {userflagData,flagerror};
            
}

//adding flag to meme 
export async function addFlagToMeme(flag:FlagModel) {
    const { data: addedFlag, error } = await supabase
         .from(TABLE_NAMES.FLAG_TABLE)
         .insert({'meme_id':flag.contentId,
             'user_id':flag.user_id,
             'reason':flag.reason,
             'created_at':flag.created_at
          })
         .select();

         return {addedFlag,error};


    
}