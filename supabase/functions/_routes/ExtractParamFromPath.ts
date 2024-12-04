//this is for extracting parameter from path
export function extractParameter(routePattern: string, path: string) {
  try {
    const routePath = routePattern.split("/");
    const actualPath = path.split("/");

    if (routePath.length != actualPath.length) {
        return null;
    }
    const params: Record<string, string> = {};

    for (let i = 0; i < routePath.length; i++) {
        if (routePath[i].startsWith(":")) {
            const paramName = routePath[i].slice(1);
            params[paramName] = actualPath[i];
        } else if (routePath[i] !== actualPath[i]) {
            return null;
        }
    }
    return params;
  } catch (error) {
    throw new Error(`Internal server error ${error}`);
  }
}
