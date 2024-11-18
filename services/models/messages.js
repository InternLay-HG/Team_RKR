import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    room:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
})
const messages=mongoose.model("messages",messageSchema);
export default messages;