import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
import bcrypt from 'bcrypt';
import collection from '../models/userschema.js';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import sendEmail from '../middleware/emailver.config.js';

router.post("/signup", async (req, res) => {
    const verificationcode = Math.floor(1000 + Math.random() * 9000);
    const data = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      username: req.body.username,
      isVerified: false,
    };
    
    const hash = await bcrypt.hash(data.password, 10);
    const existingUser = await collection.findOne({ email: req.body.email });
    if (existingUser) {
      res.send("User already exists");
    } else {
      data.password = hash;
      const userdata = await collection.insertMany(data);
      res.send(userdata);
      sendEmail(req.body.email);
      console.log(userdata);
    }
  });
  router.post("/onboarding",async (req,res)=>{
    const data = {
      bio: req.body.bio,
      institute: req.body.institute,
      birthday: req.body.birthday,
    };
    const existingUser = await collection.findOne({ email: req.body.email });
    if (existingUser) {
      const userdata = await collection.updateOne({ email: req.body.email }, { $set: data });
      res.send(userdata);
    }
  });
  
  router.post("/login", async (req, res) => {
    try {
      const check = await collection.findOne({ email: req.body.email });
      if (!check) {
        res.send("User not found");
      }
  
      const isPasswordCorrect = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordCorrect) {
        const email = req.body.email;
        const user = {
          email: check.email,
          name: check.name,
          username: check.username,
          bio: check.bio,
          institute: check.institute,
          birthday: check.birthday
        };
       
      const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
      res.json({accessToken:accessToken})
     
      } else {
        res.send("Invalid credentials");
      }
    } catch{
   
      res.send("invalid");
    }
  });
  router.get("/verify/:token",async(req,res)=>{
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const email = decoded.email;
  
      const user = await collection.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } },
      );
  
      if (user) {
        res.send("Thank you for verifying your email. You can now <a href='/login'>sign up</a>.");
  
      } else {
        res.send("User not found");
      }
    } catch (err) {
      res.status(400).send("Invalid token");
    }
  }
  
  )
  function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(token==null){
      return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
      if(err){
        return res.sendStatus(403)
      }
      req.user=user
      next()
    })
  }
  router.get('/posts',authenticateToken,(req,res)=>{
    res.json(req.user)
  })
export default router;  