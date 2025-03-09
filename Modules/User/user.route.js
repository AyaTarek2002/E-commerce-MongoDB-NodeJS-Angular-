import express from 'express';
import passport from "passport";
import { signUp ,login,forgotPassword,resetPassword,updateUserDetails, verifyEmail ,deleteUser,restrictUser,getAllUsers,getUserById} from '../User/user.controller.js';
import { EmailCheck } from '../../MiddleWare/EmailChecked.js';
import { validateUser , validateData } from "../../MiddleWare/validationUser.js";
import { verifyToken } from '../../MiddleWare/verifyToken.js';
import { isAdmin } from '../../MiddleWare/checkRole.js';


const customerRoute = express.Router();

customerRoute.post('/signUp',validateUser,EmailCheck, signUp);
customerRoute.post('/login', login);
customerRoute.put('/updateUserDetails',verifyToken,validateData,EmailCheck,updateUserDetails);
customerRoute.delete('/deleteUser/:id',verifyToken, isAdmin, deleteUser);
customerRoute.get("/verify/:email", verifyEmail)
customerRoute.put('/restrict-user/:userId', verifyToken, isAdmin, restrictUser);
customerRoute.post("/forgot-password", forgotPassword);
customerRoute.post("/reset-password/:token", resetPassword);

// تسجيل الدخول عبر Google
customerRoute.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// مسار إعادة التوجيه بعد نجاح تسجيل الدخول من Google
customerRoute.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Google authentication failed" });
        }
        const { user, token } = req.user;
        res.json({ message: `Welcome ${user.name}`, token });
    }
);

// تسجيل الدخول عبر Facebook
customerRoute.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// مسار إعادة التوجيه بعد نجاح تسجيل الدخول من Facebook
customerRoute.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { session: false}),
    
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "FaceBook authentication failed" });
        }
        const { user, token } = req.user;
        res.json({ message: `Welcome ${user.name}`, token });
    }
);

customerRoute.get("/all", verifyToken,isAdmin, getAllUsers);
customerRoute.get("/:id", verifyToken,isAdmin, getUserById);
export default customerRoute;