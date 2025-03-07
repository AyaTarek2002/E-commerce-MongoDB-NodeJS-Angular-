import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTempletes.js";
import jwt from "jsonwebtoken";

export async function sendEmail(toEmail, subject, text, useTemplate = false) {
    console.log("sendEmail function called with email:", toEmail);
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "aliaammohamed1@gmail.com",
                pass: "plrz ynzm uatj ecbt",
            },
        });

        const htmlContent = useTemplate ? emailTemplate(jwt.sign(toEmail, "myemail")) : null;

        const info = await transporter.sendMail({
            from: '"Aliaa Hesham 👻" <aliaammohamed1@gmail.com>',
            to: toEmail,
            subject: subject,
            text: text,
            ...(htmlContent && { html: htmlContent }) // إذا كان هناك HTML، أضفه إلى الإيميل
        });

        console.log("✅ Email Sent Successfully: ", info.messageId);
    } catch (error) {
        console.error("❌ Error Sending Email: ", error);
        throw error;
    }
}





























/*
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

        const myemail = jwt.sign( email , "myemail"); 
        const info = await transporter.sendMail({
          from: '"Aliaa Hesham 👻" <aliaammohamed1@gmail.com>',
          to: email,
          subject: "Welcome to our website",
          text: "From E-Commerce App",
          html: emailTemplate(myemail),
      });
      console.log("✅ Email Sent Successfully: ", info.messageId);
    } catch (error) {
        console.error("❌ Error Sending Email: ", error);
    }
}

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function sendEmail(toEmail, subject, text) {
    console.log("sendEmail function called with email:", toEmail);
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "aliaammohamed1@gmail.com",
                pass: "plrz ynzm uatj ecbt",
            },
        });

        const info = await transporter.sendMail({
            from: '"Aliaa Hesham 👻" <aliaammohamed1@gmail.com>',
            to: toEmail,
            subject: subject,
            text: text,
        });

        console.log("✅ Email Sent Successfully: ", info.messageId);
    } catch (error) {
        console.error("❌ Error Sending Email: ", error);
        throw error;
    }
}
*/