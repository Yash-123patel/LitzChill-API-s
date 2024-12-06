import { COMMON_ERROR_MESSAGES } from "../_shared/_commonErrorMessages/ErrorMessages.ts";

// Extracts parameters from a path based on a route pattern
export function extractParameter(routePattern: string, path: string) {
  try {
    const routePath = routePattern.split("/");
    const actualPath = path.split("/");

    console.log(`Route Pattern: ${routePattern}`);
    console.log(`Actual Path: ${path}`);

    // Return null if path lengths do not match
    if (routePath.length !== actualPath.length) {
      console.log("Route pattern and actual path lengths do not match.");
      return null;
    }

    const params: Record<string, string> = {};

    // Extract parameters from path
    for (let i = 0; i < routePath.length; i++) {
      if (routePath[i].startsWith(":")) {
        const paramName = routePath[i].slice(1);//removing : from route path
        params[paramName] = actualPath[i];
        console.log(`Extracted parameter: ${paramName} = ${actualPath[i]}`);
      } else if (routePath[i] !== actualPath[i]) {
        console.log(`Mismatch at position ${i}: expected ${routePath[i]} but found ${actualPath[i]}`);
        return null;
      }
    }

    console.log("Extracted Parameters:", params);
    return params;

  } catch (error) {
    console.error("Error extracting parameters:", error);
    throw new Error(`${COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR} ${error}`);
  }
}
