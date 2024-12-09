import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { TABLE_NAMES } from "../_QueriesAndTabledDetails/TableNames.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import supabase from "../_shared/_config/DBConnection.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts";

// function that checks the user's privileges before calling the main handler
export async function checkPrivillege(req: Request, roles: string[]) {
    console.log("Authorization check started...");

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("Extracted Token:", token);

    // If no token is found, return unauthorized error
    if (!token) {
        console.log("No token provided.");
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.UNAUTHORIZED,
            error_message: COMMON_ERROR_MESSAGES.MISSING_JWT_TOKEN,
        });
    }

    //getting user data from supabase auth getUser();
    const { data: authData, error: authError } = await supabase.auth.getUser(
        token,
    );
    console.log("Authentication Data:", authData);

    // If there was an error with token validation, return unauthorized error
    if (!authData || authError) {
        console.log("Invalid or expired token.");
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.UNAUTHORIZED,
            error_message: COMMON_ERROR_MESSAGES.INVALID_JWT_TOKEN,
        });
    }

    //  Fetch the user data based on user_id from the database
    const user_id = authData.user.id;
    const { data: userData, error } = await supabase
        .from(TABLE_NAMES.USER_TABLE)
        .select("account_status,lockout_time,user_type")
        .eq("user_id", user_id)
        .single();

    console.log("User Data:", userData);

    // If there is an error while fetching the user data, return internal server error
    if (error) {
        console.log("Error fetching user data:", error);
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            error_message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }

    // Check if the user's role is valid. If not, return forbidden error
    if (roles.length > 0 && !roles.includes(userData.user_type)) {
        console.log("User does not have the required role.");
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.FORBIDDEN,
            error_message: COMMON_ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        });
    }

    if (userData.account_status == "S") {
        return handleAllErrors({
            status_code: HTTP_STATUS_CODE.FORBIDDEN,
            error_message:
                `Currentlly accout is deactivated Try again after sometime.`,
        });
    }

    // If the user has the required role, proceed with the original handler
    console.log("User has valid privileges. Proceeding with the handler...");
    return {};
}
