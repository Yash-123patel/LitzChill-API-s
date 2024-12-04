import { createContest } from "../../_repository/contest-api-repo/CreateContestRepository.ts";
import { ContestModelImpl } from "../../_model/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";

export async function createContext(req: Request) {
    try {
        const contest = await req.json();
        if (Object.keys(contest).length === 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message: "Request Body is empty",
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
        const insertedData = await createContest(contestData);

        if (!insertedData || insertedData.length === 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
                error_message: "Contest not created due to some error",
                error_time: new Date(),
            });
        }

        return new Response(
            JSON.stringify({
                message: "Contest Created Successfully",
                data: insertedData,
            }),
            {
                status: Http_Status_Codes.CREATED,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        console.error("Unexpected Error:", error);
        return handleAllErrors({
            status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            error_message: `Unexpected Error ${error}`,
            error_time: new Date(),
        });
    }
}
