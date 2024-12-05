import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";
import { updateContestById } from "../../_repository/_contest-api-repo/UpdateContestDetails.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { validateContestDetails } from "../../_validation/_contestModulValidation/ValidateContestAllDetails.ts";
import { ContestValidationMessages } from "../../_shared/_contestModuleMessages/ValidationMessages.ts";
import { CommonErrorMessages } from "../../_shared/_commonErrorMessages/ErrorMessages.ts";
import { ContestModuleErrorMessages } from "../../_shared/_contestModuleMessages/ErrorMessages.ts";
import { ContestModuleSuccessMessages } from "../../_shared/_contestModuleMessages/SuccessMessages.ts";
import { HeadercontentType } from "../../_shared/_commonSuccessMessages/SuccessMessages.ts";


export async function updateContestDetails(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const contest_id = path[path.length - 1];

        if (!contest_id || !V4.isValid(contest_id)) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message:
                    ContestValidationMessages.InvalidContestId,
                error_time: new Date(),
            });
        }

        const contestDetails: Partial<ContestModelImpl> = await req.json();
        if (Object.keys(contestDetails).length === 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message: CommonErrorMessages.EmptyRequestBody,
                error_time: new Date(),
            });
        }
        contestDetails.contest_id = contest_id;

        const validationErrors = validateContestDetails(contestDetails, true);
        if (validationErrors instanceof Response) {
            return validationErrors;
        }

        contestDetails.contest_id = contest_id;
        console.log(contestDetails.contest_id);

        contestDetails.updated_at = new Date().toISOString();
        const updatedData = await updateContestById(contestDetails);

        if (!updatedData || updatedData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message: ContestModuleErrorMessages.ContestNotFoundOrDeleted,
                error_time: new Date(),
            });
        }

        return new Response(
            JSON.stringify({
                message: ContestModuleSuccessMessages.ContestUpdated,
                data: updatedData,
            }),
            {
                status: Http_Status_Codes.OK,
                headers: { [HeadercontentType.ContetTypeHeading]: HeadercontentType.ContentTypeValue },
            },
        );
    } catch (error) {
        return handleAllErrors({
            status_code: Http_Status_Codes.NOT_FOUND,
            error_message: `${CommonErrorMessages.InternalServerError} ${error}`,
            error_time: new Date(),
        });
    }
}
