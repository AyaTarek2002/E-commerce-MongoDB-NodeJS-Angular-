import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTempletes.js";
import jwt from "jsonwebtoken";

export async function sendEmail(email) {
  console.log("sendEmail function called with email:", email);
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "aliaammohamed1@gmail.com",
                pass: "plrz ynzm uatj ecbt",
            },
        });

        const myemail = jwt.sign( email , process.env.EMAIL_SECRET); 
        const info = await transporter.sendMail({
          from: '"Aliaa Hesham 👻" <aliaammohamed1@gmail.com>',
          to: email,
          subject: "Welcome to our website",
          text: "From E-Commerce App",
          html: emailTemplate(myemail),
      });
      console.log(" Email Sent Successfully: ", info.messageId);
    } catch (error) {
        console.error(" Error Sending Email: ", error);
    }
}