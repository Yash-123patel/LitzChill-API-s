
//comment Module Validation Messages
export const COMMENT_VALIDATION_MESSAGES ={
        
         PROVIDE_ALL_FIELDS: "Please provide all the required fields to add a comment.",
         INVALID_USER_ID: "Invalid user_id. Ensure it's a valid UUID format for the user_id.",
         INVALID_CONTENT_ID: "Invalid contentId. Please provide a valid UUID format for the contentId.",
         INVALID_CONTENT_TYPE: "Invalid content type. Only 'memes' or 'comment' are allowed as valid content types."
}

//Contest Module Validation Messages
export const CONTEST_VALIDATION_MESSAGES={

        INVALID_CONTEST_ID: "Invalid Contest ID. Please provide a valid UUID.",
        INVALID_CONTEST_TITLE: "Contest Title must be 3-100 characters.",
        MISSING_CONTEST_TITLE: "Contest Title is required.",
        INVALID_CONTEST_DESCRIPTION: "Description must be 8-500 characters.",
        INVALID_CONTEST_START_DATE_FORMAT: "Start Date must be in ISO 8601 format.",
        INVALID_CONTEST_START_DATE: "Start Date cannot be in the past or today.",
        MISSING_CONTEST_START_DATE: "Start Date is required.",
        INVALID_CONTEST_END_DATE_FORMAT: "End Date must be in ISO 8601 format.",
        INVALID_END_DATE: "End Date cannot be in the past or today.",
        INVALID_CONTEST_END_DATE: "End Date must be after Start Date.",
        MISSING_CONTEST_END_DATE: "End Date is required.",
        INVALID_CONTEST_STATUS: "Status must be 'Ongoing', 'Completed', or 'Upcoming'."
};

//FLAG MODULE VALIDATION MESSAGES

export const FLAG_VALIDATION_MESSAGES={
        MISSING_FIELDS:"Provide all the fields to add flag",
        INVALID_REASON:"Reason Must between (5-100) letters",
}
    