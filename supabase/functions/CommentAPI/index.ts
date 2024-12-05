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

    // Attempt to find a matching static route
    const allroute = AllRouters[path];
    console.log("Static route lookup result:", allroute);

    if (allroute) {
      // Check if a handler exists for the given HTTP method
      const handler = allroute[method];
      if (handler) {
        console.log("Handler found for static route. Invoking handler...");
        return await handler(req);
      } else {
        // Handle unsupported methods for the static route
        console.log("Method not allowed for the static route. Returning response...");
        return handleAllErrors({
          status_code: HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message: COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
          error_time: new Date(),
        });
      }
    }

    // Attempt to dynamically match the route if no static route is found
    console.log("Attempting dynamic route matching...");
    const matchedRoute = routeMatching(path, AllRouters);
    console.log("Dynamic route matching result:", matchedRoute);

    if (matchedRoute) {
      const { route, params } = matchedRoute;
      console.log(`Matched dynamic route: ${route}, Params:`, params);

      // Check if a handler exists for the given HTTP method
      const handler = route[method];
      if (handler) {
        // Admin privilege verification for DELETE requests
        if (method === HTTP_METHOD.DELETE) {
          console.log("DELETE request detected. Checking admin privileges...");
          const isAdminPrivilege = await checkForAdminPrivilege(req);
          console.log("Admin privilege check result:", isAdminPrivilege);

          if (!isAdminPrivilege) {
            console.log("Unauthorized user. Returning Forbidden response...");
            return handleAllErrors({
              status_code: HTTP_STATUS_CODE.FORBIDDEN,
              error_message: `${COMMON_ERROR_MESSAGES.UNAUTHORIZED_USER}`,
              error_time: new Date(),
            });
          }
        }

        console.log("Handler found for dynamic route. Invoking handler...");
        //calling handlers
        return await handler(req);
      } else {
        // Handle unsupported methods for the dynamic route
        console.log("Method not allowed for the dynamic route. Returning response...");
        return handleAllErrors({
          status_code: HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message: `${method} ${COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED}`,
          error_time: new Date(),
        });
      }
    }

    // Handle unmatched routes
    console.log("No matching route found. Returning Not Found response...");
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.NOT_FOUND,
      error_message: `${COMMON_ERROR_MESSAGES.ROUTE_NOT_FOUND}`,
      error_time: new Date(),
    });

  } catch (error) {
    // Handle any unexpected errors during request processing
    console.log("Internal server error occurred:", error);
    return handleAllErrors({
      status_code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      error_message: `${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`,
      error_time: new Date(),
    });
  }
});
