import express, { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    // Implementation for creating a post will go here
    // res.send("Create a new post");
    // console.log(req, res)

    try{
        const result = await postService.createPost(req.body);
        res.status(201).json(result);
    }catch(err){
        res.status(500).json({ error: "Failed to create post" });
    }
}

export const postController = { createPost };