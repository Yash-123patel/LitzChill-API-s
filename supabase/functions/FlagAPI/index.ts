import { FlagModuleRoutes } from "../_routes/flagRoutes.ts";
import { routeHandler } from "../_routes/routehandler.ts";

Deno.serve(async (req) => {
    //calling route handler
    console.log("Calling route handler")
    return await routeHandler(req,FlagModuleRoutes);
});
