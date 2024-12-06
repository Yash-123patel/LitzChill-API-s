//contest module
export interface ContestModel {
    contestid?: string;  
    contesttitle: string;
    contestdescription?: string;
    startdate: string;
    enddate: string;
    status?: string;
    result?: object;
    prize?: string;
    createdat: string;
    updatedat?: string;
}


