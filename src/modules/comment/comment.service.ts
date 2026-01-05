const createComment = async ()=>{
    console.log("create comment")
}

export const commentService = {
    createComment,
};


//   authorId String
//   post_id  String
//   post     Post   @relation(fields: [post_id], references: [post_id]) 
//   parentId String?
//   parent   Comment?  @relation("CommentsReplies", fields: [parentId], references: [comment_id])
//   replies  Comment[] @relation("CommentsReplies")

//   status CommentStatus @default(APPROVED)

//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt

//   @@index([post_id])
//   @@index([authorId])
//   @@map("comments")
// }