import mongoose from "mongoose";
export const myConnection = mongoose.connect("mongodb://localhost:27017/nodeProject")
.then(console.log("connected successfully"))
.catch((err)=>console.log(err));