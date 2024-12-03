import { decode } from 'https://deno.land/x/djwt/mod.ts';

//getting userToken
export  function getUserToken(req:Request) {

    const header = req.headers.get('Authorization');
    if(header&&header.startsWith("Bearer ")){
       return header.slice(7);
    }
    return null;
    
}

export function getUserRole(userToken: string): string | null {
    try {
      const decodedToken = decode(userToken);
      const payload=decodedToken[1];

      //returning role 
      return (payload as any).role || null; 
    } catch {
      return null;
    }
  }
  export function getUserId(userToken: string): string | null {
    try {
      const decodedToken = decode(userToken);
      const payload = decodedToken[1];
  
      // Returning user ID from 'sub' claim
      return (payload as any).sub || null;
    } catch {
      return null;
    }
  }
  