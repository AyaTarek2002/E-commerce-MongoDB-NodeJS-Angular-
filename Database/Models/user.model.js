import { Schema,model } from "mongoose";

const userSchema = Schema({
    name: String,
    email: String,
    password: String,
    phone:String,
    role:{
        type: String,
        enum:["admin" , "customer"],
        default:"customer"
    },
    isConfirmed:
    {
        type:Boolean,
        default:false
    },
    walletBalance:Number
},{
        timestamps:true, // add createdAt and updatedAt
        versionKey:false
    })
export const userModel = model("customer", userSchema);