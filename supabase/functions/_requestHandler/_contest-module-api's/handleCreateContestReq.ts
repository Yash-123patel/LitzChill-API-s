import { createContest } from "../../_repository/_contest-api-repo/CreateContestRepository.ts";
import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { ContestModuleErrorMessages } from "../../_shared/_contestModuleMessages/ErrorMessages.ts";
import { ContestModuleSuccessMessages } from "../../_shared/_contestModuleMessages/SuccessMessages.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";


export async function createContext(req: Request) {
    try {
        const contest = await req.json();

   
        if (Object.keys(contest).length === 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message: CommonErrorMessages.EmptyRequestBody,
                error_time: new Date(),
            });
        }
        const contestData = new ContestModelImpl(contest);

        const validationErrors = validateContestDetails(contestData);
        console.log(validationErrors);
        
        if (validationErrors instanceof Response) {
            return validationErrors;
        }

        contestData.created_at = new Date().toISOString();
        contestData.status=contestData.status?.toLocaleLowerCase();

        
        const insertedData = await createContest(contestData);

        if (!insertedData || insertedData.length === 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
                error_message:ContestModuleErrorMessages.ContestNotCreated,
                error_time: new Date(),
            });
        }

        return new Response(
            JSON.stringify({
                message: ContestModuleSuccessMessages.ContestCreated,
                data: insertedData,
            }),
            {
                status: Http_Status_Codes.CREATED,
                headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue }
            },
        );
    } catch (error) {
        console.error("Unexpected Error:", error);
        return handleAllErrors({
            status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            error_message: `${CommonErrorMessages.InternalServerError},${error}`,
            error_time: new Date(),
        });
    }
}
