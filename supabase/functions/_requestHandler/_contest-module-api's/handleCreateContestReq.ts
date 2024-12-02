import { createContest } from "../../_repository/contest-api-repo/CreateContestRepository.ts"
import { ContestModelImpl } from "../../_model/ContestModel.ts"
import { handleBadRequestError, handleInternalServerError } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestData } from "../../_validation/ValidateContestDetails.ts";
import { ErrorResponseImpl } from "../../_errorHandler/ErrorResponse.ts";

export async function createContext(req:Request) {

    try { 
        const contest=await req.json();
        if (Object.keys(contest).length === 0) {
            return handleBadRequestError("Request Body is empty");
        }
        const contestData=new ContestModelImpl(contest);

        if(!contestData.contest_title){
            return handleBadRequestError("Please Provide Contest_title");
        }
        if(!contestData.start_date){
            return handleBadRequestError("Please Provide contest start_date");
        }
        if(!contestData.end_date){
            return handleBadRequestError("Please Provide Contest end_date");
        }
        
        const validStatuses = ['Ongoing', 'Completed', 'Upcoming'];
       if(contestData.status){
        if (!validStatuses.includes(contestData.status)) {
            return new Response(
                JSON.stringify(new ErrorResponseImpl(Http_Status_Codes.BAD_REQUEST,"Invalid status. Must be one of 'Ongoing', 'Completed', 'Upcoming'",new Date())),
                { status: 400 ,headers:{ "Content-Type": "application/json" }}
              );
          }
          else
             contestData.status='upcoming';
       }
        const validationErrors = validateContestData(contestData);
        if(validationErrors.length!==0){
            const errorMessage = `${validationErrors.join(',  ')}`;
            return handleBadRequestError(errorMessage);
        }

         contestData.created_at=new Date().toISOString();
         const insertedData=await createContest(contestData);
        if(!insertedData || insertedData.length === 0){
           return  handleInternalServerError("Contest not created due to some error");
        }
        

        return new Response(
            JSON.stringify({message:"Contest Created Successfully",data:insertedData}),
            {status: Http_Status_Codes.CREATED,headers: { "Content-Type": "application/json" } },
          )
    } catch (error) {
        console.error("Unexpected Error:", error);
       return handleInternalServerError(`Unexpected Error ${error}`);
    }
}