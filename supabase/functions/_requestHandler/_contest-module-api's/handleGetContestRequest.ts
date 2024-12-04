import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { getContestDetailsById } from "../../_repository/contest-api-repo/GetContestDetailsById.ts";
import { V4 } from "https://deno.land/x/uuid@v0.1.2/mod.ts";

export async function getContestById(req: Request) {
    try {
        const url = new URL(req.url);
        const path = url.pathname.split("/");
        const contest_id = path[path.length - 1];

        if (!contest_id || !V4.isValid(contest_id)) {
            return handleAllErrors({
                status_code: Http_Status_Codes.BAD_REQUEST,
                error_message:
                    "Invalid Contest_id. Please provide a valid Contest_id in UUID format.",
                error_time: new Date(),
            });
        }

        const contestData = await getContestDetailsById(contest_id);

        if (!contestData || contestData.length == 0) {
            return handleAllErrors({
                status_code: Http_Status_Codes.NOT_FOUND,
                error_message:
                    "Contest Id does not exist or Maybe Contest deleted",
                error_time: new Date(),
            });
        }
        return new Response(
            JSON.stringify({ message: "Contest Details", data: contestData }),
            {
                status: Http_Status_Codes.OK,
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
