import { ContestModelImpl } from "../_model/ContestModel.ts";
import { handleBadRequestError,handleInternalServerError ,handleNotFoundError} from "../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { isValidISODate } from "../_validation/ValidateContestDetails.ts";
import { updateContestById } from "../_repository/UpdateContestDetails.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { checkContestIdIsPresentOrNot } from "../_repository/GetContestDetailsById.ts";

export async function updateContestDetails(req:Request) {

   try {
    const url=new URL(req.url);
    const path=url.pathname.split('/');
    const contest_id=path[path.length-1];

    if(!contest_id||!isNaN(Number(contest_id))|| !V4.isValid(contest_id)){
        return handleBadRequestError("Invalid Contest_id Please Provide Valid Contest_id in UUID Format");
    }

   

    const count=await checkContestIdIsPresentOrNot(contest_id);
    console.log(count);
    if(!count||count.length==0){
        return handleNotFoundError("Contest Id does not exist Or May Contest is Deleted ");
    }

    const contestDetails:Partial<ContestModelImpl>=await req.json();
    if (Object.keys(contestDetails).length === 0) {
        return handleBadRequestError("Request Body is empty");
    }
    contestDetails.contest_id=contest_id;
    contestDetails.updated_at=new Date().toISOString();
    if(contestDetails.contest_title){
        if((contestDetails.contest_title.trim().length<3) || (contestDetails.contest_title.trim().length>100)){
          return handleBadRequestError("Please Provide Valid Contest-Title")
        }
    }

    if(contestDetails.end_date){
        if(isValidISODate(contestDetails.end_date))
        {
            const end_date=new Date(contestDetails.end_date);
            const current_date=new Date();
            console.log(end_date +"  "+ current_date);
            if (end_date <= current_date) {
                return handleBadRequestError("Invalid End Date");
            }
            
        }
        else {
            return handleBadRequestError("Invalid Date Format");
          }
    }

    contestDetails.contest_id=contest_id;
    console.log(contestDetails.contest_id);


    const updatedData=await updateContestById(contestDetails);

    if(!updatedData){
        throw new Error(`Failed To update contest details`);
    }
   
    return new Response(
        JSON.stringify({message:"Contest Updated Successfully",data:updatedData}),
        {status: Http_Status_Codes.OK,headers: { "Content-Type": "application/json" } },
      )
   } catch (error) {
       return handleInternalServerError(`Unexpected Error ${error}`);
   }

}