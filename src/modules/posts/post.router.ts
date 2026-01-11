
import express, { Request, Response, Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { commentController } from "../comment/comment.controller";


const router = express.Router();





router.get("/", postController.getPosts);  
router.get("/myPosts", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPost);

router.get("/:post_id", postController.getPostById);

router.post("/",auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

router.patch("/:post_id",auth(UserRole.USER, UserRole.ADMIN), postController.updatePost);


export const postRouter:Router = router;