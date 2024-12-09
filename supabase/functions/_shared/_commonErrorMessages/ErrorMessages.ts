//commmon error messages for all modules.
export const COMMON_ERROR_MESSAGES={
    METHOD_NOT_ALLOWED: "This method is not allowed for the requested operation.",
    ROUTE_NOT_FOUND: "The requested route was not found. Please verify the URL.",
    INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
    EMPTY_REQUEST_BODY: "The request body is empty. Please provide valid data.",
    DATABASE_ERROR: "Database error occurred. Please try again.",
    MISSING_JWT_TOKEN: "Missing JWT token in the request.",
    INVALID_JWT_TOKEN: " The provided JWT token is invalid or expired.",
    UNAUTHORIZED_ACCESS: "You do not have the necessary permissions to access this resource.",
};


//comment Module All Error Messages
export const COMMENT_MODULE_ERROR_MESSAGES = {
    INVALID_COMMENT_ID: "Invalid Comment ID. Ensure you're using a valid UUID format for the Comment ID.",
    USER_NOT_FOUND: "User not found with the provided ID. Double-check the User ID and try again.",
    CONTENT_NOT_FOUND: "Content not found with this ID. Please ensure the content exists and try again.",
    FAILED_TO_ADD_COMMENT: "Failed to add your comment due to an internal error. Please try again later.",
    FAILED_TO_RETRIEVE_COMMENT_COUNT: "Unable to retrieve the comment count at the moment. Please try again later.",
    COMMENT_NOT_FOUND: "No comment found with the provided ID. Verify the ID and try again.",
};


//contest Module All error messages
export const CONTEST_MODULE_ERROR_MESSAGES={
    CONTEST_NOT_CREATED: "Unable to create contest. Please try again later.",
    CONTEST_NOT_FOUND_OR_DELETED: "Contest not found or it may have been deleted.",
    NO_CONTEST_FOUND: "No contests are available."
};
    

//flag module error messages
export const FLAG_ERROR_MESSAGES = {
    USER_ALREADY_ADDED_FLAG: "You have already flagged this content.",
    FLAG_ERROR_DURING_ADDING: "An error occurred while adding your flag. Please try again later.",
};



