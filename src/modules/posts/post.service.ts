
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
  console.log("Id by post get");
  const result = await prisma.post.findUnique({
    where: {
       post_id,  
    }
  });

  return result;
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
  getPostById
};
