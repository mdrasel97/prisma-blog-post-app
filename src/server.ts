import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
    try{
        await prisma.$connect()
        console.log('database connect successfully')

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(err){
        console.log(err)
        process.exit(1);
    }
}

main();