import { Payload } from './../../../generated/prisma/internal/prismaNamespace';

import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPosts = async (Payload:{search: string | undefined}): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: {
            OR:[
                {title: {
                contains: Payload.search as string,
                mode: "insensitive"
            }},
            {content: {
                contains: Payload.search as string,
                mode: "insensitive"
            }},
            {
                tags:{
                    has: Payload.search as string
                }
            }
            ]
        }
    });
    return posts;
}

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, User_id: string)=>{
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: User_id,
            // author: {
            //     connect: {
            //         id: User_id
            //     }
            // }
        }
    });
    return result;
}


export const postService = { 
    createPost,
    getAllPosts
 };