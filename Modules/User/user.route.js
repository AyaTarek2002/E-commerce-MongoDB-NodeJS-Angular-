import express from 'express';
import passport from "passport";

import { signUp ,login, verifyEmail } from '../User/user.controller.js';
import { EmailCheck } from '../../MiddleWare/EmailChecked.js';
import { validateUser } from "../../MiddleWare/validationUser.js";

const customerRoute = express.Router();

customerRoute.post('/signUp',validateUser,EmailCheck, signUp);
customerRoute.post('/login', login);
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