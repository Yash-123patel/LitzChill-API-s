import { handleAllErrors } from "../../_errorHandler/ErrorsHandler.ts";
import { ContestModelImpl } from "../../_model/_contestModules/ContestModel.ts";
import { Http_Status_Codes } from "../../_shared/_constant/HttpStatusCodes.ts";
import { ArrayContstant } from "../../_shared/_constant/ArrayConstants.ts";
import { ContestValidationMessages } from "../../_shared/_contestModuleMessages/ValidationMessages.ts";

export  function validateContestDetails(contestDetails: Partial<ContestModelImpl>, isUpdate: boolean = false) {
    const validationErrors: string[] = [];
    const currentDate = new Date();
    
    // Validating contest title
    if (contestDetails.contest_title) {
        if (contestDetails.contest_title.trim().length < 3 || contestDetails.contest_title.trim().length > 100) {
            validationErrors.push(ContestValidationMessages.InvalidContetTitle);
        }
    } else if (!isUpdate) {
        validationErrors.push(ContestValidationMessages.MissingContestTitle);
    }

    // Validating description
    if (contestDetails.description) {
        if (contestDetails.description.trim().length < 8 || contestDetails.description.trim().length > 500) {
            validationErrors.push(ContestValidationMessages.InvalidContestDescription);
        }
    }

    // Validating start_date
    if (contestDetails.start_date) {
        if (!isValidISODate(contestDetails.start_date)) {
            validationErrors.push(ContestValidationMessages.InvalidContestStartDateFormat);
        } else {
            const start_date = new Date(contestDetails.start_date);
            if (start_date <= currentDate ) {
                validationErrors.push(ContestValidationMessages.InvalidContestStartDate);
            }
        }
    } else if (!isUpdate) {
        validationErrors.push(ContestValidationMessages.MissingContestStartDate);
    }

    // Validating end_date
    if (contestDetails.end_date) {
        if (!isValidISODate(contestDetails.end_date)) {
            validationErrors.push(ContestValidationMessages.InvalidContestEndDateFormat);
        } else {
            const end_date = new Date(contestDetails.end_date);
            if (end_date <= currentDate) {
                validationErrors.push(ContestValidationMessages.InvalidEndDate);
            }
            if (contestDetails.start_date && isValidISODate(contestDetails.start_date)) {
                const start_date = new Date(contestDetails.start_date);
                if (start_date >= end_date) {
                    validationErrors.push(ContestValidationMessages.InvalidContestEndDate);
                }
            }
        }
    } else if (!isUpdate) {
        validationErrors.push(ContestValidationMessages.MissingContestEndDate);
    }

    // Validating status
    if (contestDetails.status) {
        const validStatuses = ArrayContstant.Conteststaus;
        if (!validStatuses.includes(contestDetails.status)) {
            validationErrors.push(ContestValidationMessages.InvalidContestStatus);
        }
    }else if (!isUpdate) {
        contestDetails.status=ArrayContstant.Conteststaus[0].toLocaleLowerCase();
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
