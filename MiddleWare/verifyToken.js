import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["token"]; 
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, "myKey", async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }
        
       // console.log("Decoded Token:", decoded);
        
        req.user = { _id: decoded.id, name: decoded.name, role: decoded.role };

        next();
    });
};
