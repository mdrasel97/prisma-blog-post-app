import app from "../app";
import { prisma } from "./prisma";

const PORT = process.env.PORT || 5000;

async function main() {
    try{
        await prisma.$connect()
        console.log('database connect successfully')

        app.listen(PORT)
    }catch(err){
        console.log(err)
    }
}