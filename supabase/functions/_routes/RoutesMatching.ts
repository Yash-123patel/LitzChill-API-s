import { extractParameter } from "./ExtractParamFromPath.ts";
type RouteHandler = (req: Request) => Promise<Response>;
type Router = Record<string, Record<string, RouteHandler>>;

//dynamic matching of routes
export function routeMatching(path:string,routes:Router){
    try {
        for(const routePattern in routes){
            const params=extractParameter(routePattern,path);
    
            if(params){
                return {route: routes[routePattern], params};
            }
        }
        return null;
    } catch (error) {
        throw new Error(`internal server error ${error}`);
    }
}
