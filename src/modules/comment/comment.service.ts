

import { prisma } from "../../lib/prisma";


const createComment = async (payload:{
    content: string;
    authorId: string;
    post_id: string;
    parentId?: string;
} )=>{
    const postData = await prisma.post.findUnique({
        where: { post_id: payload.post_id }
    });
    if (!postData) {
        throw new Error("Post not found");
    }
        if (payload.parentId) {
        await prisma.comment.findUnique({
            where: { comment_id: payload.parentId }
        });
    return await prisma.comment.create({
        data: payload
    });
};
}

const getCommentById = async (comment_id: string) => {
return await prisma.comment.findUnique({
    where: { comment_id },
    include: {
        post: {
            select:{
                post_id: true,
                title: true,
                content: true,
                views: true,
            }
        }
    }
})
}

const getCommentByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: { authorId },
        orderBy:{
            created_at: "asc"
        },
        include:{
            post:{
                select:{
                    post_id: true,
                    title: true
                }
            }
        }
    })
}


const deleteComment = async (comment_id: string, authorId: string) => {
    // console.log({comment_id, authorId});
    const commentData = await prisma.comment.findFirst({  
        where: { comment_id, authorId },
        select:{
            authorId: true
        }
    });
    if (!commentData) {
        throw new Error("Comment not found");
    }
    if (commentData.authorId !== authorId) {
        throw new Error("Unauthorized");
    }
    await prisma.comment.delete({
        where: { comment_id }
    });
}

const updateComment = async (comment_id: string, authorId: string, content: string) => {
    const commentData = await prisma.comment.findFirst({
        where: { comment_id, authorId },
        select:{
            authorId: true
        }
    });
    if (!commentData) {
        throw new Error("Comment not found");
    }
    if (commentData.authorId !== authorId) {
        throw new Error("Unauthorized");
    }
    return await prisma.comment.update({
        where: { comment_id },
        data: { content }
    });
}



const moderateComment = async () => {
    // To be implemented
    console.log("moderator comment")
}



export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}
