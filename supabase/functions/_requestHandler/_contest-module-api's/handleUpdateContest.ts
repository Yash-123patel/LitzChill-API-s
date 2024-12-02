import { ContestModelImpl } from "../../_model/ContestModel.ts";
import { handleBadRequestError,handleInternalServerError ,handleNotFoundError} from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { isValidISODate } from "../../_validation/ValidateContestDetails.ts";
import { updateContestById } from "../../_repository/contest-api-repo/UpdateContestDetails.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { checkContestIdIsPresentOrNot } from "../../_repository/contest-api-repo/GetContestDetailsById.ts";
import { ErrorResponseImpl } from "../../_errorHandler/ErrorResponse.ts";


export async function updateContestDetails(req:Request) {

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
        return handleNotFoundError("Contest Id does not exist Or May Contest is Deleted ");
    }

    const contestDetails:Partial<ContestModelImpl>=await req.json();
    if (Object.keys(contestDetails).length === 0) {
        return handleBadRequestError("Request Body is empty");
    }
    contestDetails.contest_id=contest_id;
    if(contestDetails.contest_title){
        if((contestDetails.contest_title.trim().length<3) || (contestDetails.contest_title.trim().length>100)){
          return handleBadRequestError("Please Provide Valid Contest-Title")
        }
    }
    if(contestDetails.description){
        if(contestDetails.description.trim().length>500||contestDetails.description.trim().length<8)
            return handleBadRequestError("Please Provide valid description");
    }
      
    if(contestDetails.start_date){
        if(isValidISODate(contestDetails.start_date))
        {
            const start_date=new Date(contestDetails.start_date);
            const current_date=new Date();
            console.log(start_date +"  "+ current_date);
            if (start_date <= current_date) {
                return handleBadRequestError("Invalid start date cannot be current date");
            }
            
        }
        else {
            return handleBadRequestError("Invalid Date Format");
          }
    }

    if(contestDetails.end_date){
        if(isValidISODate(contestDetails.end_date))
        {
            const end_date=new Date(contestDetails.end_date);
            const current_date=new Date();
            console.log(end_date +"  "+ current_date);
            if (end_date <= current_date) {
                return handleBadRequestError("Invalid End Date cannot be less than current date");
            }
            
        }
        else {
            return handleBadRequestError("Invalid Date Format");
          }
    }

    
    const validStatuses = ['Ongoing', 'Completed', 'Upcoming'];
    if(contestDetails.status){
        if (!validStatuses.includes(contestDetails.status)) {
            return new Response(
              JSON.stringify(new ErrorResponseImpl(Http_Status_Codes.BAD_REQUEST,"Invalid status. Must be one of 'Ongoing', 'Completed', 'Upcoming'",new Date())),
              { status: 400 ,headers:{ "Content-Type": "application/json" }}
            );
          }
       }
    contestDetails.contest_id=contest_id;
    console.log(contestDetails.contest_id);

    contestDetails.updated_at=new Date().toISOString();
    const updatedData=await updateContestById(contestDetails);

    if(!updatedData||updatedData.length==0){
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