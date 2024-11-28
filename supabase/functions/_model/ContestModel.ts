export interface Contest {
    contest_id?: string;  //primary key
    contest_title: string;
    description?: string;
    start_date: string;
    end_date: string;
    status?: string;
    result?: object;
    prize?: string;
    created_at: string;
    updated_at?: string;
}

export class ContestModelImpl implements Contest {
    contest_id?: string;
    contest_title: string;
    description?: string;
    start_date: string;
    end_date: string;
    status?: string;
    result?: object;
    prize?: string;
    created_at: string;
    updated_at?: string;
   
    constructor(data: Contest) {
        this.contest_id = data.contest_id;
        this.contest_title = data.contest_title;
        this.description = data.description;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.status = data.status;
        this.result = data.result;
        this.prize = data.prize;
        this.created_at =new Date().toISOString();
        this.updated_at = data.updated_at;
    }
}
