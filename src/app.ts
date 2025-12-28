import express, { Application }  from "express"
import { postRouter } from "./modules/posts/post.router"


const app:Application = express()


app.use(express.json())

app.use("/posts", postRouter)

app.get("/", (req, res) => {
    res.send("Welcome to Prisma Blog App")
})

export default app