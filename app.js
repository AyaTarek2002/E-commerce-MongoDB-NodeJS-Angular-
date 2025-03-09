import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import myConnection from "./Database/dbconnection.js";
import customerRoute from './Modules/User/user.route.js';
import ProductRoute from './Modules/Product/product.route.js';
import path from "path";
import CartRoute from './Modules/Cart/cart.route.js';
import { fileURLToPath } from "url";
import "./MiddleWare/passport.js"; 
import ChatRoute from "./Modules/routes/geminiRoutes.route.js";
import stripeRouter from './Modules/Payment/payment.route.js';
import orderRoutes from './Modules/orderHistory/order.route.js';
import  promoCodeRoute  from './Modules/promoCode/promocode.route.js';
import ratingRouter from "./Modules/Rating/rating.route.js";

const app = express();
app.use(express.json());

app.use(passport.initialize());

app.use( customerRoute);
app.use('/product', ProductRoute);
app.use('/cart',CartRoute);
app.use("/gemini", ChatRoute);
app.use('/pay', stripeRouter);
app.use('/order-summary', orderRoutes);
app.use('/promoCode',promoCodeRoute);
app.use('/rate',ratingRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

myConnection;

const PORT = process.env.PORT || 3030;
app.listen(3030, function(){
    console.log("Server is running on port 3030");
});