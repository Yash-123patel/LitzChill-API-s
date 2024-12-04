import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { ContestModelImpl } from "../../_model/ContestModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";


export  function validateContestDetails(contestDetails: Partial<ContestModelImpl>, isUpdate: boolean = false) {
    const validationErrors: string[] = [];
    const currentDate = new Date();

    // Validating contest title
    if (contestDetails.contest_title) {
        if (contestDetails.contest_title.trim().length < 3 || contestDetails.contest_title.trim().length > 100) {
            validationErrors.push("Please provide a valid Contest Title (3-100 characters).");
        }
    } else if (!isUpdate) {
        validationErrors.push("Contest Title is required.");
    }

    // Validating description
    if (contestDetails.description) {
        if (contestDetails.description.trim().length < 8 || contestDetails.description.trim().length > 500) {
            validationErrors.push("Please provide a valid Description (8-500 characters).");
        }
    }

    // Validating start_date
    if (contestDetails.start_date) {
        if (!isValidISODate(contestDetails.start_date)) {
            validationErrors.push("Invalid Start Date format. Must be in ISO 8601 format.");
        } else {
            const start_date = new Date(contestDetails.start_date);
            if (start_date <= currentDate && isUpdate) {
                validationErrors.push("Start Date cannot be in the past or current date during updates.");
            }
        }
    } else if (!isUpdate) {
        validationErrors.push("Start Date is required.");
    }

    // Validating end_date
    if (contestDetails.end_date) {
        if (!isValidISODate(contestDetails.end_date)) {
            validationErrors.push("Invalid End Date format. Must be in ISO 8601 format.");
        } else {
            const end_date = new Date(contestDetails.end_date);
            if (end_date <= currentDate) {
                validationErrors.push("End Date cannot be in the past or current date.");
            }
            if (contestDetails.start_date && isValidISODate(contestDetails.start_date)) {
                const start_date = new Date(contestDetails.start_date);
                if (start_date >= end_date) {
                    validationErrors.push("Start Date cannot be greater than or equal to End Date.");
                }
            }
        }
    } else if (!isUpdate) {
        validationErrors.push("End Date is required.");
    }

    // Validating status
    if (contestDetails.status) {
        const validStatuses = ["Ongoing", "Completed", "Upcoming","ongoing", "completed", "upcoming"];
        if (!validStatuses.includes(contestDetails.status)) {
            validationErrors.push("Invalid Status. Must be one of 'Ongoing', 'Completed', 'Upcoming'.");
        }
    }else if (!isUpdate) {
        contestDetails.status="Upcoming";
    }

    if (validationErrors.length > 0) {
        return handleAllErrors({
            status_code: Http_Status_Codes.BAD_REQUEST,
            error_message: validationErrors.join(", "),
            error_time: new Date(),
        });
    }

    return {};
}
export function isValidISODate(date: string): boolean {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    return isoDateRegex.test(date);
}
