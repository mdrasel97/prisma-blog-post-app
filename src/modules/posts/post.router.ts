
import express, { Request, Response, Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();





router.get("/", postController.getPosts);

router.post("/",auth(UserRole.USER), postController.createPost);


export const postRouter:Router = router;