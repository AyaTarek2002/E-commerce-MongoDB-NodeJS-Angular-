import dotenv from "dotenv";
dotenv.config();
import express from "express";
import myConnection from "./Database/dbconnection.js";
import customerRoute from './Modules/User/user.route.js';
import ProductRoute from './Modules/Product/product.route.js';
import path from "path";
import CartRoute from './Modules/Cart/cart.route.js';
import { fileURLToPath } from "url";
import ChatRoute from "./Modules/routes/geminiRoutes.route.js";
import stripeRouter from './Modules/Payment/payment.route.js';

const app = express();
app.use(express.json());

app.use('/customer', customerRoute);
app.use('/product', ProductRoute);
app.use('/cart',CartRoute);
app.use("/gemini", ChatRoute);
app.use('/pay', stripeRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

myConnection

app.listen(3300, function(){
    console.log("Server is running on port 3030");
});