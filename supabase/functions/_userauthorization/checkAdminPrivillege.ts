import { decode } from "https://deno.land/x/djwt/mod.ts";
import { getUserTypeFromUsers } from "../_repository/_user-api-repo/GetUserType.ts";

export async function checkForAdminPrivilege(req: Request): Promise<boolean> {
    //getting token
    const header = req.headers.get("Authorization");

    //checking if it is containing Bearer then it is removing Bearer
    if (header && header.startsWith("Bearer ")) {
        try {
            const token = header.slice(7);
            return await decodeTokenGetUserRole(token);
        } catch (error) {
            console.error("Error decoding token:", error);
            return false;
        }
    }
    return false;
}

//decoding token and getting userRole based on user id
async function decodeTokenGetUserRole(token: string): Promise<boolean> {
    try {
        const decodedToken = decode(token);
        console.log("Token: "+decodedToken);
        const payload = decodedToken[1];
        const userId = (payload as any).sub||null;

        if(!userId)
            return false;

        console.log("User Id: "+userId);

        const userRoles = await getUserTypeFromUsers(userId);

        console.log(userRoles);
        if(!userRoles||userRoles.length==0)
            return false;

        const userRole = userRoles[0].user_type;

        console.log("User Role: "+userRole);

        if (!userRole) {
            return false;
        }

        console.log("User role:", userRole);

        return (userRole === "A");
    } catch (error) {
        console.error("Error in decoding token:", error);
        return false;
    }
}
