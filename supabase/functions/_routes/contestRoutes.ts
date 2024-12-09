import { handleDeleteContest } from "../_requestHandler/_contest-module-api's/handleDeleteRequestContest.ts";
import {handleCreateContext} from "../_requestHandler/_contest-module-api's/handleCreateContestReq.ts";
import { handlegetAllContest } from "../_requestHandler/_contest-module-api's/handleGetAllContestRequest.ts";
import { handlegetContestById } from "../_requestHandler/_contest-module-api's/handleGetContestRequest.ts";
import { HTTP_METHOD } from "../_shared/_constant/HttpMethods.ts";
import { CONTEST_ROUTES } from "../_shared/_routePathAndHandler/RoutePathAndHandler.ts";
import { handleupdateContestDetails } from "../_requestHandler/_contest-module-api's/handleUpdateContest.ts";

//define all routes for Contest Module
export const ContestModuleRoutes={

    //POST Method Related Routes
    [HTTP_METHOD.POST]:{
        [CONTEST_ROUTES.CONTEST_CREATE_PATH]:
            handleCreateContext,

    }
    ,
     //GET Method Related Routes
    [HTTP_METHOD.GET]:{
        [CONTEST_ROUTES.CONTEST_GET_ALL_PATH]:
            handlegetAllContest,
           
        [CONTEST_ROUTES.CONTEST_GET_BY_ID_PATH]:
            handlegetContestById,
           
    }
    ,
     //DELETE Method Related Routes
    [HTTP_METHOD.DELETE]:{
        [CONTEST_ROUTES.CONTEST_DELETE_BY_ID_PATH]:
            handleDeleteContest,
           
    }
    ,
     //PATCH Method Related Routes
    [HTTP_METHOD.PATCH]:{
        [CONTEST_ROUTES.CONTEST_UPDATE_BY_ID_PATH]:
             handleupdateContestDetails,
    }

}