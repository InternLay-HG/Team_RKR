import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import fs from "fs";
import messages from "./models/messages.js";
import mongoose from "mongoose";
import path from "path";
dotenv.config();
const kafka = new Kafka({
    brokers:[process.env.KAFKA_URL],
    ssl:{
        ca:[fs.readFileSync(path.resolve('./services/ca.pem'),"utf-8")],
    },
    sasl:{
        mechanism:"plain",
        username:process.env.KAFKA_USER,
        password:process.env.KAFKA_PASS}
});

let producer=null
export async function createProducer() {
    if (producer) return producer;  
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}
export async function produceMessage(message){
const producer = await createProducer();
await producer.send({
    topic:"MESSAGES",
    messages:[{key:`message=${Date.now()}`,value:message}]
})
return true;
}
export async function startMessageConsumer(){
    console.log('Consumer started')
    const consumer=kafka.consumer({groupId:"default"});
    await consumer.connect();
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true});

    await consumer.run({
        autoCommit:true,
        eachMessage:async ({message,pause})=>{
            console.log('New message received')
            if(!message.value){
                return
            }
            try {
            const newMessage =new messages({
                message:JSON.parse(message.value.toString()).roommessage.message,
                room:JSON.parse(message.value.toString()).roommessage.room,
                username:JSON.parse(message.value.toString()).roommessage.username
            });
            await newMessage.save();} catch (error) {
                console.log(error)
                pause()
                setTimeout(()=>{
                    consumer.resume([{topic:"MESSAGES"}])
                },60*1000)
            }
        }
    })
}
export default kafka;