import { routeHandler } from "../_routes/routehandler.ts";
import { CommentModuleRoutes } from "../_routes/commentRoutes.ts";

Deno.serve(async (req) => {
  //calling route handler by passing request and module related all routes
  console.log("Calling route handler")
  return await routeHandler(req,CommentModuleRoutes);
});