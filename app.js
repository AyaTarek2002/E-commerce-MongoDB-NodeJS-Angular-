import express from "express";
import { myConnection } from "./Database/dbconnection.js";




const app = express();
app.use(express.json())

myConnection


app.listen(3030, function(){
    console.log("Server is running on port 3000");
})