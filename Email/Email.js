import nodemailer from "nodemailer"
import { emailTemplate } from "./emailTempletes.js";
import jwt from "jsonwebtoken";

export async function sendEmail(email){ 
    const transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "aliaammohamed1@gmail.com",
        pass: "nimh bbls pjru zrnf",
    },
});
  const myemail = jwt.sign(email, "myemail")
  const info = await transporter.sendMail({
    from: '"Aliaa Hesham 👻" <aliaammohamed1@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Welcome to our website", // Subject line
    text: "From E-Commerce App", // plain text body
    html: emailTemplate(myemail), // html body
  });

  console.log("Message sent: %s", info.messageId);
}

