import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: false
    },
    institute:{
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    birthday: {
        type: Date,
        required: false
}
,
isVerfied:{
    type: Boolean,
    default: false
},});

const user = mongoose.model("users", UserSchema);
export default user;
