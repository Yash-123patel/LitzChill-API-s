import { ContestRoutes } from "../_routes/contestRoutes.ts";
import { routeHandler } from "../_routes/routehandler.ts";

Deno.serve(async (req) => {
  return await routeHandler(req,ContestRoutes);
  });
  
