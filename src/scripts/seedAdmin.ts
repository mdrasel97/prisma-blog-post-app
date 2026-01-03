import { email } from "better-auth/*";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {

        console.log("admin seeding started")

        const adminData = {
            email: "admin2@example.com",
            name: "Admin User",
            role: UserRole.ADMIN,
            password: "admin1234",
            emailVerified: true
        };
        console.log("checking admin ")
        const adminExists = await prisma.user.findUnique({
            where: { email: adminData.email },
        });
            if (adminExists) {
            throw new Error("Admin user already exists");
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData)
        });

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: { email: adminData.email },
                data: { emailVerified: true }
            });
        }
        console.log("Admin user created:", signUpAdmin);
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
}

seedAdmin();