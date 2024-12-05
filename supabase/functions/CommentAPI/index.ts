import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { AllRouters } from "../_routes/RooutesMaping.ts";
import { routeMatching } from "../_routes/RooutesMaping.ts";
import { CommonErrorMessages } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { Http_Method } from "../_shared/_constant/HttpMethods.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { checkForAdminPrivilege } from "../_userauthorization/checkAdminPrivillege.ts";

Deno.serve(async (req) => {
 
  try {
    const method=req.method;
  const url=new URL(req.url);
  const path=url.pathname;

  //routing for static path
  const allroute = AllRouters[path];
  console.log("allroute ",allroute);

    if (allroute) {
      const handler = allroute[method];
      if (handler) {
        return await handler(req);
      } else {
        return handleAllErrors({
          status_code: Http_Status_Codes.METHOD_NOT_ALLOWED,
          error_message: CommonErrorMessages.MethodNotAllowed,
          error_time: new Date(),
        });
      }
    }


    //dynamic matching for routing
  const matchedRoute = routeMatching(path, AllRouters);

  if(matchedRoute){
    const {route,params} = matchedRoute;

    const handler = route[method];
    console.log(handler+"  "+params);

    if (handler) {
      if(method===Http_Method.DELETE){

        //checking for admin privillege
        const isAdminPrivillege=await checkForAdminPrivilege(req);
        console.log("is Admin: "+isAdminPrivillege);
        if(!isAdminPrivillege){
          return handleAllErrors({status_code:Http_Status_Codes.FORBIDDEN,error_message:` ${CommonErrorMessages.UnAuthorizedUser}`,error_time:new Date()});
        }  
      }

      return await handler(req);
    } else {
      return handleAllErrors({status_code:Http_Status_Codes.METHOD_NOT_ALLOWED,error_message:`${method} ${CommonErrorMessages.MethodNotAllowed}`,error_time:new Date()});
     
    }
  }
  return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:`${CommonErrorMessages.RouteNotFound}`,error_time:new Date()});

  } catch (error) {
    return handleAllErrors({status_code:Http_Status_Codes.INTERNAL_SERVER_ERROR,error_message:`${CommonErrorMessages.InternalServerError} ${error}`,error_time:new Date()});
  }
});
 

