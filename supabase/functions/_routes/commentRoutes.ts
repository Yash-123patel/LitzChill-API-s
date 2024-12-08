import { checkPrivillege } from "../_middleware/CheckAuthorization.ts";
import { handleAddComment } from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts";
import { handleDeleteComment } from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";
import { HTTP_METHOD } from "../_shared/_constant/HttpMethods.ts";
import { USER_ROLES } from "../_shared/_constant/UserRoles.ts";
import { COMMENT_ROUTES } from "../_shared/_routePathAndHandler/RoutePathAndHandler.ts";


//define all routes for Comment Module
export const CommentModuleRoutes={

  //POST Method Related Routes
    [HTTP_METHOD.POST]:{
        [COMMENT_ROUTES.COMMENT_ADD_PATH]:checkPrivillege(
            handleAddComment,
            [
              USER_ROLES.ADMIN_ROLE,
              USER_ROLES.USER_ROLE
            ]
        )
    }
    ,
    //Delete Method Related Routes
    [HTTP_METHOD.DELETE]:{
        [COMMENT_ROUTES.COMMENT_DELETE_BY_ID_PATH]:checkPrivillege(
              handleDeleteComment,
              [
                USER_ROLES.ADMIN_ROLE
              ]
        )
    }

}