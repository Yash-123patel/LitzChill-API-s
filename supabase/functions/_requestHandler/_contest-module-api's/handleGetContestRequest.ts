import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { getContestDetailsById } from "../../_repository/_contest-api-repo/GetContestDetailsById.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";
import { ContestValidationMessages } from "../../_shared/_contestModuleMessages/ValidationMessages.ts";
import { ContestModuleErrorMessages } from "../../_shared/_contestModuleMessages/ErrorMessages.ts";
import { ContestModuleSuccessMessages } from "../../_shared/_contestModuleMessages/SuccessMessages.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";

export async function getContestById(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const contest_id = path[path.length - 1];

        if (!contest_id || !V4.isValid(contest_id)) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message:ContestValidationMessages.InvalidContestId,
                error_time: new Date(),
            });
        }

        const contestData = await getContestDetailsById(contest_id);

        if (!contestData || contestData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message:
                    ContestModuleErrorMessages.ContestNotFoundOrDeleted,
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
