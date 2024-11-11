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
})
const messages=mongoose.model("messages",messageSchema);
export default messages;