import { handleAllErrors } from "../_errorHandler/ErrorsHandler.ts";
import { AllRouters } from "../_routes/RooutesMaping.ts";
import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/_constant/HttpStatusCodes.ts";

Deno.serve(async (req) => {
  try {
    // Extracting HTTP method, URL, and path from the incoming request
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    console.log(`Received request - Method: ${method}, Path: ${path}`);

    // Attempt to find a static route match
    const route = AllRouters[path];
    console.log("Route lookup result:", route);

    // If a matching route is found
    if (route) {
      const handler = route[method];
      if (handler) {
        console.log("Handler found for static route. Invoking handler...");
        return await handler(req); // Call the handler for the matched route
      } else {
        // No handler for the specified HTTP method
        console.log("Returning Method Not Allowed response from static route");
        return handleAllErrors({
          status_code: HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          error_message: COMMON_ERROR_MESSAGES.METHOD_NOT_ALLOWED,
          error_time: new Date(),
        });
      }
    }

    // If no route matches, return a Route Not Found response
    console.log("No matching route found. Returning Route Not Found response.");
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
