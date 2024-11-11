import { Server } from 'socket.io';
import Redis from 'ioredis';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { startMessageConsumer } from './kafka.js';
import messages from './models/messages.js';
import { produceMessage } from './kafka.js';
dotenv.config();
import express from 'express';
const connect = mongoose.connect("mongodb://localhost:27017/Interlay");
connect.then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
  console.log(err);
});
const serviceurl=process.env.REDIS_URL;
console.log(serviceurl);
startMessageConsumer();
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
    socket.on('message', async (message) => {
      console.log(`Message: ${message}`);
await pub.publish('MESSAGES', JSON.stringify({message}));
    });
  });  
sub.on('message', async (channel, message) => {
 if(channel==="MESSAGES") {
  io.emit("message", message);
 await produceMessage(message);
  console.log(`message produced to kafka`);

 }
});

server.listen(3000, () => {
  console.log('listening on port:3000');
} ); 