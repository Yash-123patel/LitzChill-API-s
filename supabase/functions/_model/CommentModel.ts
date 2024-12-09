
//comment module
export interface Comment {
    commentid?: string; 
    meme_id: string;     
    user_id: string;    
    comment: string;  
    created_at?: Date;    
    status?: string;
    parent_commentId?:any
  }
  
