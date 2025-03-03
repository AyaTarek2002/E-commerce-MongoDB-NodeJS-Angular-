import express from "express";
import myConnection from "./Database/dbconnection.js";
import customerRoute from './Modules/User/user.route.js';
import ProductRoute from './Modules/Product/product.route.js';
import path from "path";
import CartRoute from './Modules/Cart/cart.route.js';
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

app.use('/customer', customerRoute);
app.use('/product', ProductRoute);
app.use('/cart',CartRoute)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

myConnection

app.listen(3000, function(){
    console.log("Server is running on port 3030");
});