import { userModel } from "../Database/Models/user.model.js";

export const EmailCheck = async (req,res,next) =>
{
    let foundUser = await userModel.findOne({email:req.body.email});
    if(foundUser){
        return res.json({message:"user already exists!"});
    }else{
        next();
    }
}