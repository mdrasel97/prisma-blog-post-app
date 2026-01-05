import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
   try {
       const result = await commentService.createComment();
       res.status(201).json(result);
   } catch (err) {
       res.status(500).json({ error: "Failed to create comment" });
   }
}