import { ContestModelImpl } from "../_model/ContestModel.ts";


export function validateContestData(contestData:ContestModelImpl){
    const validationErrors:string[]=[];
    

    if((!contestData.contest_title) || (contestData.contest_title.trim().length<3) || (contestData.contest_title.trim().length>100)){
        validationErrors.push("Please Provide Valid Contest-Title");
    }
    if(contestData.description){
        if(contestData.description.trim().length>500||contestData.description.trim().length<8)
            validationErrors.push("Please Provide Valid Description");
    }
      

    let isDate = true;
    
    if (!contestData.start_date || !contestData.end_date) {
        validationErrors.push("Both start_date and end_date are required.");
        isDate = false;  
    }

    if (isDate && (!isValidISODate(contestData.start_date) || !isValidISODate(contestData.end_date))) {
        validationErrors.push("Invalid Date Format. Date must be in ISO 8601 format. Example: 2024-12-01T12:00:00Z");
        isDate = false; 
    }
    
    if (isDate) {
        const start_date = new Date(contestData.start_date);
        const end_date = new Date(contestData.end_date);
        if (start_date >= end_date) {
            validationErrors.push("Contest Start Date Cannot Be Greater Than End Date");
        }
    }
    
    return validationErrors;
   
}
function isValidISODate(date: string): boolean {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    return isoDateRegex.test(date);
}