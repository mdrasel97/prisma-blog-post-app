import express, { Request, Response } from "express";
import { postService } from "./post.service";



const getPosts = async (req: Request, res: Response) => {
    // Implementation for fetching posts will go here
    // res.send("Get all posts");   

    try{
        const {search}= req.query;
        // console.log("search value", search)
        const searchString = typeof search === "string" ? search : undefined;
        const posts = await postService.getAllPosts({search: searchString});
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}


const createPost = async (req: Request, res: Response) => {
    // Implementation for creating a post will go here
    // res.send("Create a new post");
    // console.log(req, res)

    try{

        if(!req.user){
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await postService.createPost(req.body, req.user?.id as string);
        res.status(201).json(result);
    }catch(err){
        res.status(500).json({ error: "Failed to create post" });
    }
}

export const postController = { 
    createPost,
    getPosts
};