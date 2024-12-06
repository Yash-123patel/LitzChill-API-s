import { createContext } from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts";
import { getContestById } from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts";
import { handleDeleteContest } from "../_requestHandler/_contest-module-api's/handleDeleteRequestContest.ts";
import { updateContestDetails } from "../_requestHandler/_contest-module-api's/handleUpdateContest.ts";
import { handleAddComment } from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts";
import { handleDeleteComment } from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";
import { extractParameter } from "./ExtractParamFromPath.ts";
import { getAllContest } from "../_requestHandler/_contest-module-api's/handleGetAllContestRequest.ts";

import { HTTP_METHOD } from "../_shared/_constant/HttpMethods.ts";
import {
    COMMENT_ROUTES,
    CONTEST_ROUTES,
    FLAG_ROUTES,
} from "../_shared/_routePathAndHandler/RoutePathAndHandler.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAddFlagRequest } from "../_requestHandler/_flag-module-api/handleAddFlagRequest.ts";


type RouteHandler = (req: Request) => Promise<Response>;
type Router = Record<string, Record<string, RouteHandler>>;


//mapping all the routes in one place
export const AllRouters: Router = {

    //contest module routes
    [CONTEST_ROUTES.CONTEST_CREATE_PATH]: {
        [HTTP_METHOD.POST]: createContext,
    },
    [CONTEST_ROUTES.CONTEST_GET_ALL_PATH]: {
        [HTTP_METHOD.GET]: getAllContest,
    },
    [CONTEST_ROUTES.CONTEST_GET_BY_ID_PATH]: {
        [HTTP_METHOD.GET]: getContestById,
    },
    [CONTEST_ROUTES.CONTEST_UPDATE_BY_ID_PATH]: {
        [HTTP_METHOD.PATCH]: updateContestDetails,
    },
    [CONTEST_ROUTES.CONTEST_DELETE_BY_ID_PATH]: {
        [HTTP_METHOD.DELETE]: handleDeleteContest,
    },


    //comment module routes
    [COMMENT_ROUTES.COMMENT_ADD_PATH]: {
        [HTTP_METHOD.POST]: handleAddComment,
    },
    [COMMENT_ROUTES.COMMENT_DELETE_BY_ID_PATH]: {
        [HTTP_METHOD.DELETE]: handleDeleteComment,
    },

    
    //flag module routes
    [FLAG_ROUTES.ADD_FLAG_TO_MEME]:{
        [HTTP_METHOD.POST]:handleAddFlagRequest
    }
};

//dynamic matching of routes
export function routeMatching(path: string, routes: Router) {
    try {
        for (const routePattern in routes) {
            const params = extractParameter(routePattern, path);

            if (params) {
                return { route: routes[routePattern], params };
            }
        }
        return null;
    } catch (error) {
        throw new Error(`${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR}${error}`);
    }
}
