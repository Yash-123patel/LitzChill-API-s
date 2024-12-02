import { handleMethodNotAllowedError } from "../_errorHandler/ErrorsHandler.ts";
import {handleAddComment} from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts"
import {handleDeleteComment} from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";

//fututre need to implement only comment user or admin can delete comment
Deno.serve(async (req) => {
 
  if(req.method==="POST"){
      return await handleAddComment(req);
  }

  if(req.method==="DELETE"){
    return await handleDeleteComment(req);
  }

  return handleMethodNotAllowedError(req.method);
})



