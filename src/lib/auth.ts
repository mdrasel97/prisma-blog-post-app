
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user:{
        additionalFields:{
            role:{
                type: "string",
                defaultValue: "user",
                required: false,
            },
            phone:{
                type: "string",
                required: false,
            },
            status:{
                type: "string",
                defaultValue: "active",
                required: false,
            }
        }
    },
     emailAndPassword: { 
    enabled: true, 
    autoSignIn: false,
    requireEmailVerification: true
  }, 
   emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
try{
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
     const info = await transporter.sendMail({
    from: '"prisma blog app" <mollarasel972@gmail.com>',
    to: user.email!,
    subject: "Please verify your email",
    // text: "Hello world?", 
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 30px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px;">
          <tr>
            <td align="center">
              <h2 style="color:#333; margin-bottom:10px;">Verify Your Email Address ${user.name}</h2>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                Thank you for signing up for <strong>Prisma Blog App</strong>.<br/>
                Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <a href="${verificationUrl}"
                style="
                  display:inline-block;
                  margin:25px 0;
                  padding:12px 28px;
                  background-color:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:6px;
                  font-weight:bold;
                ">
                Verify Email
              </a>

              <p style="color:#777; font-size:13px; line-height:1.6;">
                If the button doesn’t work, copy and paste the link below into your browser:
              </p>

              <p style="word-break: break-all; color:#2563eb; font-size:13px;">
                ${verificationUrl}
              </p>

              <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />

              <p style="color:#999; font-size:12px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>

              <p style="color:#999; font-size:12px; margin-top:10px;">
                © ${new Date().getFullYear()} Prisma Blog App
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
  });

  console.log("Message sent:", info.messageId);
}catch(error){
    console.error("Error sending verification email:", error);
}
    },
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});