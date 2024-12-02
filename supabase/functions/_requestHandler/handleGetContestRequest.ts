import { handleBadRequestError, handleInternalServerError, handleNotFoundError } from "../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import {checkContestIdIsPresentOrNot} from "../_repository/GetContestDetailsById.ts"
import { getContestDetailsById } from "../_repository/GetContestDetailsById.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";


export async function getContestById(req:Request) {

    try { 
      
        const url=new URL(req.url);
        const path=url.pathname.split('/');
        const contest_id=path[path.length-1];

        if (!contest_id || !V4.isValid(contest_id)) {
            return handleBadRequestError("Invalid Contest_id. Please provide a valid Contest_id in UUID format.");
        }
       
        const count=await checkContestIdIsPresentOrNot(contest_id);
        console.log(count);
        if(count==0){
            return handleNotFoundError("Contest Id does not exist or contest is deleted");
        }

        const contestData=await getContestDetailsById(contest_id);
    
        if (!contestData|| contestData.length==0) {
            return handleNotFoundError('MayBe Contest deleted');
        }
        return new Response(
            JSON.stringify({message:"Contest Details",data:contestData}),
            {status: Http_Status_Codes.OK,headers: { "Content-Type": "application/json" } },
          )
    } catch (error) {
        console.error("Unexpected Error:", error);
       return handleInternalServerError(`Unexpected Error ${error}`);
    }
}