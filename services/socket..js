import { Server } from 'socket.io';
import Redis from 'ioredis';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { startMessageConsumer } from './kafka.js';
import messages from './models/messages.js';
import { getObjectURL,putObject,deleteObject } from './aws.js';

import db from '../db.js';
import { produceMessage } from './kafka.js';
dotenv.config();
import express from 'express';
db();
const serviceurl=process.env.REDIS_URL;

const pub=new Redis(serviceurl);
const sub=new Redis(serviceurl);
sub.subscribe('MESSAGES')
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
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
server.listen(3000, () => {
  console.log('listening on port:3000');
} ); 