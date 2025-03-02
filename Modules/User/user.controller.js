import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {userModel} from "../../Database/Models/user.model.js";
import { sendEmail } from "../../Email/Email.js";
import { catchError } from "../../MiddleWare/catchError.js";
export const signUp = catchError(
    async (req,res) => {
    console.log("SignUp function called"); 
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    if (req.body.role === "admin") {
        req.body.isConfirmed = true;
    } else {
        req.body.isConfirmed = false;
    }
    const addUser = await userModel.insertMany(req.body);// insertMany return an Array of object
    if (req.body.role === "customer") {
        await sendEmail(req.body.email);   
         console.log("Sending email to:", req.body.email); 

    }
    addUser[0].password = undefined;// remove password from the response
    res.status(201).json({message:"done", addUser});// 201 status code is used for created
})
export const login = catchError(
async (req,res)=>
{
    let foundUser = await userModel.findOne({email:req.body.email});
    if(foundUser && bcrypt.compareSync( req.body.password, foundUser.password)&&(foundUser.isConfirmed==true)){
        let token = jwt.sign({
            id: foundUser._id,
            name: foundUser.name,
            role: foundUser.role
        },"myKey"); // secret key is used to sign the token and it's name is hello
        
        res.status(200).json({message:`welcome ${foundUser.name}`, token});
    }else{
        res.status(401).json({message:"Check your Email to confirm!"});
    }
})
export const verifyEmail =  (req,res) => {
    const token = req.params.email
    console.log(token)
    jwt.verify(token, "myemail",async (err, decoded) => {
        if(err){
         return res.status(401).json({message: "Invalid token"})
        }
        const email = decoded;
        await userModel.findOneAndUpdate({email: email}, {isConfirmed: true})
        res.json({message: "Email verified"})
    })
}