import { checkPrivillege } from "../_middleware/CheckAuthorization.ts";
import { handleAddFlagRequest } from "../_requestHandler/_flag-module-api/handleAddFlagRequest.ts";
import { HTTP_METHOD } from "../_shared/_constant/HttpMethods.ts";
import { FLAG_ROUTES } from "../_shared/_routePathAndHandler/RoutePathAndHandler.ts";
import { USER_ROLES } from "../_shared/_constant/UserRoles.ts";

//define all flag Module Routes
export const FlagModuleRoutes={

    //POST Method Related Routes
    [HTTP_METHOD.POST]:{
        [FLAG_ROUTES.ADD_FLAG_TO_MEME]:checkPrivillege(
            handleAddFlagRequest,
            [
              USER_ROLES.ADMIN_ROLE,
              USER_ROLES.USER_ROLE
            ]
        )
    }
}