import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
      user: "7f9575001@smtp-brevo.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
console.log(transporter)
const sendEmail = async (email) => {
    try {
        const token = jwt.sign({
            email
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1d"
        });
        await transporter.sendMail({
            from: "7f9575001@smtp-brevo.com", 
            to: email, 
            subject: "Email Verification", 
            text: "Please verify your email address by clicking the link below \n\n" + `http://localhost:3000/verify/${token}`, 
            
          });}
          catch (err) {
            console.log(err);
          }
        };
        sendEmail("expectopatronum2453@gmail.com")
        export default sendEmail;