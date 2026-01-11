import  cors  from 'cors';
import express, { Application } from "express";
import { postRouter } from "./modules/posts/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { commentRouter } from './modules/comment/comment.router';
import errorHandler from './middlewares/globalErrorHandler';

const app: Application = express();



app.use(express.json());

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", commentRouter);


app.get("/", (req, res) => {
  res.send("Welcome to Prisma Blog App");
});

app.use(errorHandler)


export default app;
