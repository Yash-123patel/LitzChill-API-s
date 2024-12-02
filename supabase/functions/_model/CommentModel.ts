export interface Comment {
    comment_id?: string; 
    meme_id: string;     
    user_id: string;    
    comment: string;  
    created_at: Date;    
    status: string;
    content_type:string;
  }
  
  export class CommentImpl implements Comment {
    comment_id?: string;
    meme_id: string;
    user_id: string;
    comment: string;
    created_at: Date;
    status: string;
    content_type:string;
  
    
    constructor(data: {
      comment_id?: string; 
      meme_id: string;
      user_id: string;
      comment: string;
      created_at?: Date; 
      status: string;
      content_type:string;
    }) {
      this.comment_id = data.comment_id;  
      this.meme_id = data.meme_id;
      this.user_id = data.user_id;
      this.comment = data.comment;
      this.created_at = data.created_at || new Date(); 
      this.status = data.status;
      this.content_type=data.content_type;
    }
  }
  