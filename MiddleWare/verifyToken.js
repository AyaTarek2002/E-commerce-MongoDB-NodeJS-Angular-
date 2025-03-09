import jwt from "jsonwebtoken";

export const verifyToken = (req, res,next)=>{
    const token = req.headers["token"];
    if (!token) {
       return res.status(403).json({ message: "Access denied. No token provided." });
    }
    jwt.verify(token,process.env.JWT_SECRET,async (err, decoded)=>{
        if(err){
            res.status(401).json({message: "invalid credits"});
        }else{
            req.user = decoded;
            next();
        }
    });
}
