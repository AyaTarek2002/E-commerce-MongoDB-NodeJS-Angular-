import jwt from "jsonwebtoken";
import { userModel } from "../Database/Models/user.model.js"; 

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // استخراج التوكين بعد Bearer

        jwt.verify(token, "myKey", async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token. Unauthorized access." });
            }

            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            if (user.status === "restricted") {
                return res.status(403).json({ message: "Your account is restricted. Access denied." });
            }

            req.user = user; // ✅ الآن `req.user` يحمل بيانات المستخدم كاملة وليس فقط `id`
            console.log("Authenticated User:", req.user); 

            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};


