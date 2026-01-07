import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { get } from "node:http";

const createComment = async (req: Request, res: Response) => {
   try {

    const user = req.user;
    req.body.authorId = user?.id as string;
       const result = await commentService.createComment(req.body);
       res.status(201).json(result);
   } catch (err) {
       res.status(500).json({ error: "Failed to create comment" });
   }
}

const getCommentById = async (req: Request, res: Response) => {
   try {

    const {commentId} = req.params;
    const result = await commentService.getCommentById(commentId as string);
       res.status(200).json(result);
   } catch (err) {
       res.status(500).json({ error: "Failed to fetched comment" });
   }
}

const getCommentByAuthor = async (req: Request, res: Response) => {
   try {
    const {authorId} = req.params;
    const result = await commentService.getCommentByAuthor(authorId as string);
       res.status(200).json(result);
   } catch (err) {
       res.status(500).json({ error: "Failed to fetched comment" });
   }
}

const deleteComment = async (req: Request, res: Response) => {
    try{
        const user = req.user;
        const {commentId} = req.params;
        await commentService.deleteComment(commentId as string, user?.id as string);
        res.status(200).json({ message: "Comment deleted successfully" });

    } catch(err){
        res.status(500).json({ error: "Failed to delete comment" });
    }
}

export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment
};