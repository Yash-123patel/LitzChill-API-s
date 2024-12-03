import supabase from "../../_shared/_config/DBConnection.ts";

export async function getContestDetailsById(contest_id:string) {
    
      try {
        const{data:contestData,error}=await supabase
        .from('contest')
        .select('contest_title, description, start_date, end_date, status, prize')
        .eq('contest_id',contest_id)
        .neq('status',"deleted");  

        if(error){
          throw new Error(`Database Error ${error}`);
        }

        
        return contestData;
      } catch (error) {
        throw new Error(`Internal Server Error ${error}`);
      }
  
}