import jwt from "jsonwebtoken";

export const verifyToken = (req, res,next)=>{
    const token = req.headers["token"];
    jwt.verify(token,"myKey",async (err, decoded)=>{
        if(err){
            res.status(401).json({message: "invalid credits"});
        }else{
            req.user = decoded;
            next();
        }
    });
}