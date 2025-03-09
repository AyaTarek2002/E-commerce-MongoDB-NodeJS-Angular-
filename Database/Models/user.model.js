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
    },status:{
        type:String,
        enum:["active", "restricted", "banned"],
        default:"active"
    },
    status: { type: String, enum: ["active", "restricted" , "panned"], default: "active" },
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