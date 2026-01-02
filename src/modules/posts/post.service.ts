import { auth } from './../../lib/auth';
// import { Post, Prisma } from "@prisma/client";
import { Post, PostStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPosts = async ({
  search,
  tags,
  featured,
  status,
  authorId,
}: {
  search?: string | undefined;
  tags?: string[] | undefined;
  featured: boolean | undefined;
  status?: PostStatus | undefined;
  authorId?: string | undefined;
}): Promise<Post[]> => {
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
  });

  return posts;
};

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

export const postService = {
  createPost,
  getAllPosts,
};
