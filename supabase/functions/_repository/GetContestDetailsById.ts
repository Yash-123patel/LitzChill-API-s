import supabase from "../_shared/_config/DBConnection.ts";

export async function checkContestIdIsPresentOrNot(contest_id: string) {
  try {
      
     const { count, error } = await supabase
               .from('contest')
               .select('*', { count: 'exact', head: true }) 
               .eq('contest_id', contest_id)
               .neq('status', "Deleted");

          console.log(count);
      if (error) {
          console.error('Database error:', error.message);  
          throw new Error(`Database error: ${error.message}`);
      }

      return count;
  } catch (error) {
     
      console.error('Internal server error:', error);
      throw new Error(`Internal server error: ${ error}`);
  }
}


export async function getContestDetailsById(contest_id:string) {
    
      try {
        const{data:contestData,error}=await supabase
        .from('contest')
        .select('contest_title, description, start_date, end_date, status, prize')
        .eq('contest_id',contest_id)
        .neq('status',"Deleted");  

        if(error){
          throw new Error(`Database Error ${error}`);
        }

        
        return contestData;
      } catch (error) {
        throw new Error(`Internal Server Error ${error}`);
      }
  
}