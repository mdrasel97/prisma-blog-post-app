
import express, { Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            }
        }}}

const auth = (...roles: UserRole[]) => {
  // Authentication logic here
  return async (req: Request, res: Response, next: Function) => {
    // await auth(req, res, next);
   try{
     const session = await betterAuth.api.getSession({
        headers: req.headers as any,
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(!session.user.emailVerified){
        return res.status(403).json({ message: "Please verify your email to access this resource." });
    }

    req.user = {
        id: session.user.id,
        name: session.user.name || "",          
        email: session.user.email || "",
        role: session.user.role || "user",
        emailVerified: session.user.emailVerified || false
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // console.log(session);
    next();
   }catch(err){
    return res.status(401).json({ error: "Unauthorized" });
   }
  };
}

export default auth

router.post("/",auth(UserRole.USER), postController.createPost);


export const postRouter:Router = router;