interface ErrorResponse{
    status_code:number;
    error_message:string;
    error_time:Date;
}

export class ErrorResponseImpl implements ErrorResponse{
    status_code:number;
    error_message:string;
    error_time:Date;

    constructor(status_code:number,error_message:string,error_time:Date){
        this.status_code=status_code;
        this.error_message=error_message;
        this.error_time=error_time;
    }
}