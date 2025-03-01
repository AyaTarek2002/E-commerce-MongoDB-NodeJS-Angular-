
import mongoose from "mongoose";

export const myConnection = mongoose.connect("mongodb://127.0.0.1:27017/nodeProject")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err.message));