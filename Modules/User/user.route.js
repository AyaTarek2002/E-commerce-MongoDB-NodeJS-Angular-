import express from 'express';
<<<<<<< Updated upstream
import { signUp ,login,updateUserDetails, verifyEmail ,deleteUser} from '../User/user.controller.js';
=======
import passport from "passport";

import { signUp ,login, verifyEmail } from '../User/user.controller.js';
>>>>>>> Stashed changes
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

// تسجيل الدخول عبر Google
customerRoute.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// مسار إعادة التوجيه بعد نجاح تسجيل الدخول من Google
customerRoute.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.json({ message: `Welcome ${req.user.name}`, token: req.user._id });
    }
);

// تسجيل الدخول عبر Facebook
customerRoute.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// مسار إعادة التوجيه بعد نجاح تسجيل الدخول من Facebook
customerRoute.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.json({ message: `Welcome ${req.user.name}`, token: req.user._id });
    }
);

export default customerRoute;