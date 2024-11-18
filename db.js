import mongoose from "mongoose";
function db() {
    const connect = mongoose.connect("mongodb://localhost:27017/Interlay");

    connect.then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log(err);
    });
}

export default db;