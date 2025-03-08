import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config(); 

import myConnection from "./Database/dbconnection.js";
import customerRoute from './Modules/User/user.route.js';
import ProductRoute from './Modules/Product/product.route.js';
import path from "path";
import { fileURLToPath } from "url";
import "./MiddleWare/passport.js"; // استدعاء ملف المصادقة

const app = express();
app.use(express.json());


// إعداد جلسة المستخدم
app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use( customerRoute);
app.use('/product', ProductRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

myConnection;

app.listen(3030, function(){
    console.log("Server is running on port 3000");
});