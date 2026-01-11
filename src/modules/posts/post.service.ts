import { Boolean } from './../../../generated/prisma/internal/prismaNamespace';

import { auth } from './../../lib/auth';
// import { Post, Prisma } from "@prisma/client";
import { CommentStatus, Post, PostStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { count } from 'node:console';
import { publicDecrypt } from 'node:crypto';
import { promise } from 'better-auth/*';

const getAllPosts = async ({
  search,
  tags,
  featured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}: {
  search?: string | undefined;
  tags?: string[] | undefined;
  featured: boolean | undefined;
  status?: PostStatus | undefined;
  authorId?: string | undefined;
  page?: number | undefined;
  limit?: number;
  skip?: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}): Promise<{ data: Post[]; count: number; page?: number | undefined; limit?: number | undefined; totalPages: number | undefined }> => {
  const andConditions: Prisma.PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search, // works if tags is String[]
          },
        },
      ],
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if(typeof featured === "boolean"){
    andConditions.push({
        isFeatured: featured
    })
  }



  if (status) {
    andConditions.push({
      status: status,
    });
  }

    if (authorId) {
      andConditions.push({
        authorId: authorId,
      });
    }

  const posts = await prisma.post.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    ...(skip !== undefined && { skip }),
    ...(limit !== undefined && { take: limit }),
    orderBy:
      sortBy && sortOrder
        ? (({ [sortBy]: sortOrder as Prisma.SortOrder } as Prisma.PostOrderByWithRelationInput))
        : ({ createdAt: "desc" } as Prisma.PostOrderByWithRelationInput),
  });

  const count = await prisma.post.count({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
  });

  return {
    data: posts,
    count: count,
    page: page,
    limit: limit,
    totalPages: limit ? Math.ceil(count / limit) : undefined,
  };
};


const getPostById = async (post_id: string) => {
  return await prisma.$transaction(async (tx) => {

    // check post exists
    const post = await tx.post.findUnique({
      where: { post_id },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // views increment
    await tx.post.update({
      where: { post_id },
      data: {
        views: { increment: 1 },
      },
    });

    // Full post data return
    const postData = await tx.post.findUnique({
      where: { post_id },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            replies: {
              include: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return postData;
  });
};


const getMyPost = async (authorId: string) => {


  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "active"
    }
  })

    const result = await prisma.post.findMany({
        where: {authorId},
        orderBy:{
            created_at: "desc"
        },
        include:{
          _count:{
            select:{
              comments:true
            }
          }
        }
    })

    const total = await prisma.post.aggregate({
      _count:{
        post_id: true
      },
      where: {authorId}
    })

    return {
        data: result,
        total
    };

}

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  return prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
};

const updatePost = async (post_id: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
  const postData = await prisma.post.findFirstOrThrow({
    where: { post_id },
    select:{
      authorId: true,
      post_id: true
    }
  });
  if (  !isAdmin && (postData.authorId !== authorId)) {
    throw new Error("Unauthorized to update this post");
  }

  if(!isAdmin){
    delete data.isFeatured
  }

  const result = await prisma.post.update({
    where: { post_id },
    data,
  });
  return result;
}


const deletePost = async(post_id: string, authorId: string, isAdmin: boolean)=>{
const postData = await prisma.post.findFirstOrThrow({
  where:{
    post_id
  },
  select:{
    post_id:true,
    authorId: true
  }
})

if (  !isAdmin && (postData.authorId !== authorId)) {
    throw new Error("Unauthorized to update this post");
  }

  return await prisma.post.delete({
    where:{
      post_id
    }
  })
}
  


const getStats = async()=>{

  // post count, published post, draft post, total count, total views
  return await prisma.$transaction(async(tx)=>{
    const [totalPosts,publishedPosts, draftPosts, archivedPosts, totalComments, approvedComment] = await Promise.all([
    await tx.post.count() ,
    await tx.post.count({where:{status : PostStatus.PUBLISHED}}),
    await tx.post.count({where:{status : PostStatus.DRAFT}}),
    await tx.post.count({where:{status : PostStatus.ARCHIVED}}),
    await tx.comment.count(),
    await tx.comment.count({where: {status: CommentStatus.APPROVED}})
    ])
    
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      archivedPosts,
      totalComments,
      approvedComment
    }
  })
}


export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats
};  
