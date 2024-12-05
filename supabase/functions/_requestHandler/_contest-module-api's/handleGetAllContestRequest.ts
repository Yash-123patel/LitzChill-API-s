import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { getAllContestDetails } from "../../_repository/_contest-api-repo/GetAllContestRepository.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";

import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { ContestModuleErrorMessages } from "../../_shared/_contestModuleMessages/ErrorMessages.ts";
import { ContestModuleSuccessMessages } from "../../_shared/_contestModuleMessages/SuccessMessages.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function getAllContest(req: Request) {
    try {
    
         req;
        const contestData=await getAllContestDetails();

        if (!contestData || contestData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message:
                    ContestModuleErrorMessages.NoContestFound,
                error_time: new Date(),
            });
        }
        return new Response(
            JSON.stringify({ message: ContestModuleSuccessMessages.ContestDetails, data: contestData }),
            {
                status: Http_Status_Codes.OK,
                headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue },
            },
        );
    } catch (error) {
        console.error("Unexpected Error:", error);
        return handleAllErrors({
            status_code: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            error_message: `${CommonErrorMessages.InternalServerError} ${error}`,
            error_time: new Date(),
        });
    }
}
