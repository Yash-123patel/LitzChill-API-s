import { createContext } from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts";
import { getContestById } from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts";
import { deleteContest } from "../_requestHandler/_contest-module-api's/handleDeleteRequest.ts";
import { updateContestDetails } from "../_requestHandler/_contest-module-api's/handleUpdateContest.ts";
import { handleAddComment } from "../_requestHandler/_comment-module-api/handleAddCommentReq.ts";
import { handleDeleteComment } from "../_requestHandler/_comment-module-api/hanldeDeleteCommentReq.ts";
import { extractParameter } from "./ExtractParamFromPath.ts";
import { getAllContest } from "../_requestHandler/_contest-module-api's/handleGetAllContestRequest.ts";

import { Http_Method } from "../_shared/_constant/HttpMethods.ts";
import {
    CommentRoutes,
    ContestRoutes,
    FlagRoutes,
} from "../_shared/_routePathAndHandler/RoutePathAndHandler.ts";
import { CommonErrorMessages } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { handleAddFlagRequest } from "../_requestHandler/_flag-module-api/handleAddFlagRequest.ts";


type RouteHandler = (req: Request) => Promise<Response>;
type Router = Record<string, Record<string, RouteHandler>>;

//mapping all the routes in one place
export const AllRouters: Router = {

    //contest module routes
    [ContestRoutes.ContestCreatePath]: {
        [Http_Method.POST]: createContext,
    },
    [ContestRoutes.ContestGetAllPath]: {
        [Http_Method.GET]: getAllContest,
    },
    [ContestRoutes.ContestGetByIdPath]: {
        [Http_Method.GET]: getContestById,
    },
    [ContestRoutes.ContestUpdateByIdPath]: {
        [Http_Method.PATCH]: updateContestDetails,
    },
    [ContestRoutes.ContestDeleteByIdPath]: {
        [Http_Method.DELETE]: deleteContest,
    },


    //comment module routes
    [CommentRoutes.CommentAddPath]: {
        [Http_Method.POST]: handleAddComment,
    },
    [CommentRoutes.CommentDeleteByIdPath]: {
        [Http_Method.DELETE]: handleDeleteComment,
    },

    //flag module routes
    [FlagRoutes.ADDFLAGTOMEME]:{
        [Http_Method.POST]:handleAddFlagRequest
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
        throw new Error(`${CommonErrorMessages.InternalServerError}${error}`);
    }
}
