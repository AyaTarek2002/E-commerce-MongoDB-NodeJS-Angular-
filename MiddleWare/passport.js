import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import jwt from "jsonwebtoken";
import { userModel } from "../Database/Models/user.model.js";
import dotenv from "dotenv";

dotenv.config();
// إنشاء توكن JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // التوكن صالح لمدة 7 أيام
    );
};
// تسجيل المستخدم في الجلسة
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     const user = await userModel.findById(id);
//     done(null, user);
// });

// إعداد Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3030/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await userModel.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        isConfirmed: true,
                        role: "customer",
                    });
                }

                const token = generateToken(user);
                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// إعداد Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "emails"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.emails?.[0]?.value });

                if (!user) {
                    user = await userModel.create({
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
                        isConfirmed: true,
                        role: "customer",
                    });
                }

                const token = generateToken(user);
                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
