import { createContext } from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts";
import { getContestById } from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts";
import { deleteContest } from "../_requestHandler/_contest-module-api's/handleDeleteRequest.ts";
import { updateContestDetails } from "../_requestHandler/_contest-module-api's/handleUpdateContest.ts";
import { handleAddComment } from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts";
import { handleDeleteComment } from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";

type RouteHandler = (req: Request) => Promise<Response>;
type Router = Record<string, Record<string, RouteHandler>>;

//mapping all the routes in one place
export const AllRouters:Router={
    "/ContestModule":{
        POST:createContext
    },
    "/ContestModule/getById/:id":{
        GET:getContestById
    },
    "/ContestModule/updateById/:id": {
        PATCH: updateContestDetails
   },
   "/ContestModule/deleteById/:id": {
        DELETE: deleteContest
   },
   "/CommentAPI/addComment": {
        POST: handleAddComment
   }, 
   "/CommentAPI/deleteComment/:id":{
        DELETE:handleDeleteComment
   }

}


