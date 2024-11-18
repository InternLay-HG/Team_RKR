import express from 'express';

import http from 'node:http';
import passport from 'passport';
import dotenv from 'dotenv';
import db from './db.js';
import session from 'express-session';
import mongoose from "mongoose";
import AuthRoutes from "./routes/userauth.js";
import GoogleRoutes from "./routes/signinwithgoogle.js";
import { Server } from 'socket.io';
import AWSRoutes from './routes/aws.js';
import Redis from 'ioredis';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { startMessageConsumer } from './services/kafka.js';
import { getObjectURL,putObject,deleteObject } from './services/aws.js';
import { produceMessage } from './services/kafka.js';

dotenv.config();
db();

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", AuthRoutes);
app.use("/auth", GoogleRoutes);
app.use("/file",AWSRoutes)

const serviceurl=process.env.REDIS_URL;
const pub=new Redis(serviceurl);
const sub=new Redis(serviceurl);
sub.subscribe('MESSAGES')

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get('/chat', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('joinroom',({username,room})=>{
      socket.join(room);
      socket.username=username;
      socket.room=room;
      socket.to(room).emit('message', `${username} joined ${room}`);
      console.log(`${username} joined ${room}`);
    });
    socket.on('message', async (message) => {
      const roommessage={
        room:socket.room,
        message:message,
        username:socket.username
      }
      console.log(`Message: ${message}`);
await pub.publish('MESSAGES', JSON.stringify({roommessage}));
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.to(socket.room).emit('message', `${socket.username} has left the room`);
    });
  });  
sub.on('message', async (channel, message) => {
 if(channel==="MESSAGES") {
  io.to(JSON.parse(message).roommessage.room).emit('message', JSON.parse(message).roommessage.message);
 await produceMessage(message);
  console.log(`message produced to kafka`);
 }
});
startMessageConsumer();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});