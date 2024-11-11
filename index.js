import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from './models/userschema.js';
import session from 'express-session';
import mongoose from "mongoose";
import { Strategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import sendEmail from './middleware/emailver.config.js';
dotenv.config();

const connect = mongoose.connect("mongodb://localhost:27017/Interlay");

connect.then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
});

const PORT = 3000;
const app = express();

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {

    let user = await User.findOne({ googleId: profile.id });
    const email = profile.emails[0].value;
    const domain = email.substring(email.lastIndexOf("@") + 1);
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        username: domain,
        password: "signinbygoogle",
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  res.send(`Welcome to our website}`);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.post("/signup", async (req, res) => {
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
app.post("/onboarding",async (req,res)=>{
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

app.post("/login", async (req, res) => {
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
app.get("/verify/:token",async(req,res)=>{
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
app.get('/posts',authenticateToken,(req,res)=>{
  res.json(req.user)
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});