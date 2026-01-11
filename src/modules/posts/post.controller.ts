
import express, { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelpers";
import { UserRole } from '../../middlewares/auth';



const getPosts = async (req: Request, res: Response) => {
    // Implementation for fetching posts will go here
    // res.send("Get all posts");   

    try{
        const {search}= req.query;
        // console.log("search value", search)
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : undefined;

        const featured = req.query.isFeatured 
        ? req.query.isFeatured === "true" 
        ? true 
        : req.query.isFeatured === "false" 
        ? false 
        : undefined
        : undefined;



        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper({
            page: Number(req.query.page ?? 1),
            limit: Number(req.query.limit ?? 10),
            sortBy: req.query.sortBy as string | undefined,
            sortOrder: req.query.sortOrder as string | undefined,
        });

        const posts = await postService.getAllPosts({ search: searchString, tags, featured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}

const getPostById = async (req: Request, res: Response) => {
    try{

        const {post_id} = req.params ;
        // console.log(post_id) 
        if(!post_id){
            return  res.status(400).json({ error: "Post ID is required" });
        }
        const result = await postService.getPostById(post_id);
        res.status(200).json(result);

    }catch(error){
        console.log(error)
    }
}

const getMyPost = async (req: Request, res: Response) => {
    try{
        const user = req.user; 
        console.log("user data", user)
        const result = await postService.getMyPost(user?.id as string);
        res.status(200).json(result);
    } catch(err){
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}


const createPost = async (req: Request, res: Response, next:NextFunction) => {
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
        next(err)
    }
}

const updatePost = async (req: Request, res: Response) => {
    try{
        const user = req.user
        if(!user){
            return res.status(401).json({ error: "Unauthorized" });
        }

        const {post_id} = req.params ;
        const isAdmin = user?.role === UserRole.ADMIN;
        console.log(user)
        if(!post_id){
            return res.status(400).json({ error: "Post ID is required" });
        }

        const result = await postService.updatePost(post_id as string, req.body, user.id, isAdmin);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: "Failed to update post" });
    }
}


const deletePost = async (req: Request, res: Response) => {
    try{
        const user = req.user
        if(!user){
            return res.status(401).json({ error: "Unauthorized" });
        }

        const {post_id} = req.params ;
        const isAdmin = user?.role === UserRole.ADMIN;
        console.log(user)
        if(!post_id){
            return res.status(400).json({ error: "Post ID is required" });
        }

        const result = await postService.deletePost(post_id as string, user.id, isAdmin);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: "Failed to delete post" });
    }
}
const getStats = async (req: Request, res: Response) => {
    try{
        
        const result = await postService.getStats();
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: "Failed to get stats post" });
    }
}



export const postController = { 
    createPost,
    getPosts,
    getPostById,
    getMyPost,
    updatePost,
    deletePost,
    getStats
};  