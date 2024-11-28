import { ContestModelImpl } from "../_model/ContestModel.ts";

export function validateContestData(contestData:ContestModelImpl){
    const validationErrors:string[]=[];

    if(contestData.contest_title?.length<3||contestData.contest_title?.length>100){
        validationErrors.push("Please Provide Valid Contest-Title");
    }
    if(contestData.description){
        if(contestData.description.length>500||contestData.description.length<8)
            validationErrors.push("Please Provide Valid Description");
    }
    const start_date=new Date(contestData.start_date);
    const end_date=new Date(contestData.end_date);
   
    if(!isValidISODate(start_date)||!isValidISODate(end_date))
        validationErrors.push("Invalid Date Format");
    

    if(start_date>=end_date){
        validationErrors.push("Start Date Must Before End Dat");
    }
    
    return validationErrors;
   
}
function isValidISODate(date: Date): boolean {
    const isoDateString = date.toISOString(); 
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/; 
    return regex.test(isoDateString);  
}
