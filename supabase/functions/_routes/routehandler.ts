import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts"



//performing routing 
export async function routeHandler(req:Request,routes:Record<string,any>){

    //extracting method and path from url
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    console.log(`Request received in route handler - Method: ${method}, Path: ${path}`);

    //finding all method routes path into single array
    console.log("routes array",Object.values(routes));
    const allRoutes = Object.values(routes).flatMap((methodRoutes) =>
        Object.keys(methodRoutes)
      );
      console.log("allroutes",allRoutes);
      console.log("paths",path);

      //finding all matching routes based on method
      const allMatchedMethodRoutes=routes[method];

      //if method is not match is undefined then we are returning undefined
      if(allMatchedMethodRoutes==undefined){
        return handleAllErrors({
          status_code:HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message:COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
          error_time:new Date()
         })
      }

      //checking our path is present into path key array 
      console.log("include",allRoutes.includes(path));
      if(allRoutes.includes(path)){
        console.log("if executed");
        //we are calling correct method for that path or not
          if (!allMatchedMethodRoutes || !allMatchedMethodRoutes?.[path]) {
                 console.error(`Method '${method}' not allowed for route '${path}'`);
                 return handleAllErrors({
                 status_code:HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
                 error_message:COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
                 error_time:new Date()
                })
            }
            
        }

        //checking for static routes if present then calling handler
        if (allMatchedMethodRoutes[path]) {
            return await allMatchedMethodRoutes[path](req);
        }

          //checking for dyanamic route matching 
        for (const routePattern in allMatchedMethodRoutes) {
            const param = extractParameter(routePattern, path);
            if (param) {
              const {id}=param;
                //calling handler if path is correct 
              return await allMatchedMethodRoutes[routePattern](req, id);
            } 
         }

         //again checking after dynamic route if route is present but method not supported
         const trimmedPath = path.split('/').slice(0, -1).join('/')+'/:id';
         console.log("trimmed path",trimmedPath);
          if(allRoutes.includes(trimmedPath)){
            return handleAllErrors({
              status_code:HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
              error_message:COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
              error_time:new Date()
             })
          }  
        
          //returning route not found response
        return handleAllErrors({
            status_code:HTTP_STATUS_CODE.NOT_FOUND,
            error_message:COMMON_ERROR_MESSAGES.ROUTE_NOT_FOUND,
            error_time:new Date()
        })
}



// Extracts parameters from a path based on a route pattern
export function extractParameter(routePattern: string, path: string) {

      const routePath = routePattern.split("/");
      const actualPath = path.split("/");

      // Return null if path lengths do not match
        if (routePath.length !== actualPath.length) {
         console.log("Route pattern and actual path lengths not match.");
         return null;
        }

        const params: Record<string, string> = {};

      // Extract parameters from path
       for (let i = 0; i < routePath.length; i++) {
           if (routePath[i].startsWith(":")) {
              const paramName = routePath[i].slice(1);//removing : from route path
              params[paramName] = actualPath[i];
              console.log(`Extracted parameter: ${paramName} = ${actualPath[i]}`);
            } 
            else if (routePath[i] !== actualPath[i]) {
                  console.log(`Mismatch at position ${i}: expected ${routePath[i]} but found ${actualPath[i]}`);
                  return null;
            }
        }

        console.log("Extracted Parameters:", params);
        return params;

}



