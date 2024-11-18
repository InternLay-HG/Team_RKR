import { Router } from "express";
const router = Router();
import passport from 'passport';
import User from '../models/userschema.js';
import { Strategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();

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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

router.get('/profile', (req, res) => {
    console.log(req.user);
   res.send(`the user is ${req.user}`);
  });
  
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });  
export default router;  