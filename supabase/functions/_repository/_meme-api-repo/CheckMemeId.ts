import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../../_shared/_config/DBConnection.ts";

//checking meme id is present or not
export async function checkContentId(contentID: string) {
    try {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .eq('meme_id', contentID);

    if (error) {
        throw new Error(`${CommonErrorMessages.DataBaseError} ${error.message}`);
    }   
    console.log("user", JSON.stringify(data)); 
      return data;
    } catch (error) {
      console.error("Unexpected error:", error);
      throw new Error(`${error}`);
    }
}