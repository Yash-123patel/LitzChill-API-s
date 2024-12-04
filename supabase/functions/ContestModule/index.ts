import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { AllRouters } from "../_routes/RooutesMaping.ts";
import { routeMatching } from "../_routes/RoutesMatching.ts";
import { Http_Method } from "../_shared/_constant/HttpMethods.ts";
import { Http_Status_Codes } from "../_shared/_constant/HttpStatusCodes.ts";
import { checkForAdminPrivilege } from "../_userauthorization/checkAdminPrivillege.ts";

Deno.serve(async (req) => {
 
  try {
    const method=req.method;
    const url=new URL(req.url);
    const path=url.pathname;

  const matchedRoute = routeMatching(path, AllRouters);

  if(matchedRoute){
    const {route,params} = matchedRoute;

    const handler = route[method];
    console.log(handler+"  "+params);

    if (handler) {
      if(method===Http_Method.POST||method===Http_Method.PATCH||method===Http_Method.DELETE){
        const isAdminPrivillege=await checkForAdminPrivilege(req);
        console.log("is Admin: "+isAdminPrivillege);
        
        if(!isAdminPrivillege){
          return handleAllErrors({status_code:Http_Status_Codes.FORBIDDEN,error_message:`User Not Authorized To Access `,error_time:new Date()});
        }  
      }
       // Call the appropriate handler
      return await handler(req);
      
    } else {
      return handleAllErrors({status_code:Http_Status_Codes.METHOD_NOT_ALLOWED,error_message:`${method} Not Allowed for this operation `,error_time:new Date()});
     
    }
  }
  return handleAllErrors({status_code:Http_Status_Codes.NOT_FOUND,error_message:`Route Not Found`,error_time:new Date()});

  } catch (error) {
    return handleAllErrors({status_code:Http_Status_Codes.INTERNAL_SERVER_ERROR,error_message:`Internal Server error ${error}`,error_time:new Date()});
  }
});
 

