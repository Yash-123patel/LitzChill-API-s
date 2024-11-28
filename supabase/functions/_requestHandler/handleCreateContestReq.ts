import { createContest } from "../_repository/CreateContestRepository.ts"
import { ContestModelImpl } from "../_model/ContestModel.ts"
import { handleBadRequestError, handleInternalServerError } from "../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { validateContestData } from "../_validation/ValidateContestDetails.ts";

export async function createContext(req:Request) {

    try { 
        const contest:ContestModelImpl=await req.json();
        
       
        const validationErrors = validateContestData(contest);
        if(validationErrors.length!==0){
            const errorMessage = `${validationErrors.join(',  ')}`;
            return handleBadRequestError(errorMessage);
        }

         const insertedData=await createContest(contest);
        if(!insertedData || insertedData.length === 0){
           return  handleInternalServerError("Contest not created due to some error");
        }

        return new Response(
            JSON.stringify({message:"Contest Created Successfully",data:insertedData}),
            {status: Http_Status_Codes.CREATED,headers: { "Content-Type": "application/json" } },
          )
    } catch (error) {

       return handleInternalServerError(`Unexpected Error ${error}`);
    }
}