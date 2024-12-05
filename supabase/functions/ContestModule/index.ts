import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { AllRouters } from "../_routes/RooutesMaping.ts";
import { routeMatching } from "../_routes/RooutesMaping.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { HTTP_METHOD } from "../_shared/_constant/HttpMethods.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts";
import { checkForAdminPrivilege } from "../_userauthorization/checkAdminPrivillege.ts";

Deno.serve(async (req) => {
  try {
    // Extracting HTTP method, URL, and path from the request
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    console.log(`Request received - Method: ${method}, Path: ${path}`);

    // Check if the request matches any static route
    const route = AllRouters[path];
    console.log("Static route lookup result:", route);

    if (route) {
      // Check if the route has a handler for the given HTTP method
      const handler = route[method];
      console.log("Handler for static route:", handler);

      if (handler) {
        if (method === HTTP_METHOD.POST) {
          // Verify admin privileges for POST requests
          const isAdminPrivilege = await checkForAdminPrivilege(req);
          console.log("Admin privilege check:", isAdminPrivilege);

          if (!isAdminPrivilege) {

            console.log("Returning Forbidden response for unauthorized user on static POST route");
            return handleAllErrors({
              status_code: HTTP_STATUS_CODE.FORBIDDEN,
              error_message: `${COMMON_ERROR_MESSAGES.UNAUTHORIZED_USER}`,
              error_time: new Date(),
            });
          }
        }
        console.log("Calling handler for static route");
        return await handler(req); // Call the route handler
      }
     else {
       //returning unsupported method response
        console.log("Returning Method Not Allowed response for unsupported method on static route");
        return handleAllErrors({
          status_code: HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message: COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
          error_time: new Date(),
        });
      }
    }

    // Attempt dynamic route matching if no static route is found
    const matchedRoute = routeMatching(path, AllRouters);
    console.log("Dynamic route match result:", matchedRoute);

    if (matchedRoute) {
      const { route, params } = matchedRoute;
      const handler = route[method];
      console.log(`Dynamic route handler: ${handler}, Params:`, params);

      if (handler) {
        if (
          method === HTTP_METHOD.POST ||
          method === HTTP_METHOD.PATCH ||
          method === HTTP_METHOD.DELETE
        ) {
          // Verify admin privileges for POST, PATCH, and DELETE requests
          const isAdminPrivilege = await checkForAdminPrivilege(req);
          console.log("Admin privilege check:", isAdminPrivilege);


          if (!isAdminPrivilege) {
            console.log("Returning Forbidden response for unauthorized user on dynamic route");
            return handleAllErrors({
              status_code: HTTP_STATUS_CODE.FORBIDDEN,
              error_message: `${COMMON_ERROR_MESSAGES.UNAUTHORIZED_USER}`,
              error_time: new Date(),
            });
          }
        }
        console.log("Calling handler for dynamic route");
        return await handler(req); // Call the route handler
      } else {
        // No handler for the specified HTTP method
        console.log("Returning Method Not Allowed response for unsupported method on dynamic route");
        return handleAllErrors({
          status_code: HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message: `${method} ${COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED}`,
          error_time: new Date(),
        });
      }
    }

     // If no route matches, return a Route Not Found response
    console.log("Returning Route Not Found response");
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.NOT_FOUND,
      error_message: `${COMMON_ERROR_MESSAGES.ROUTE_NOT_FOUND}`,
      error_time: new Date(),
    });
  } catch (error) {

    // Handle any unexpected errors during request processing
    console.log("Returning Internal Server Error response for unexpected error: from index.ts",error);
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      error_message: `${COMMON_ERROR_MESSAGES.ROUTE_NOT_FOUND} ${error}`,
      error_time: new Date(),
    });
  }
});
