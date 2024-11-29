import { handleBadRequestError,handleInternalServerError ,handleNotFoundError} from "../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { checkContestIdIsPresentOrNot } from "../_repository/GetContestDetailsById.ts";
import { deleteContestById } from "../_repository/DeleteContestById.ts";

export async function deleteContest(req:Request) {
   try{
         const url=new URL(req.url);
         const path=url.pathname.split('/');
         const contest_id=path[path.length-1];

         if(!contest_id||!isNaN(Number(contest_id))|| !V4.isValid(contest_id)){
            return handleBadRequestError("Invalid Contest_id Please Provide Valid Contest_id in UUID Format");
        }

         const count=await checkContestIdIsPresentOrNot(contest_id);

         if(!count||count.length==0){
            return handleNotFoundError("Contest Id does not exist Or May Contest is Deleted"); 
         }

         const deletedData=await deleteContestById(contest_id);
         
      return new Response(
        JSON.stringify({message:"Contest Deleted Successfully"}),
        {status: Http_Status_Codes.OK,headers: { "Content-Type": "application/json" } },
      )
   }
    catch (error) {
       return handleInternalServerError(`Unexpected Error ${error}`);
   }

}