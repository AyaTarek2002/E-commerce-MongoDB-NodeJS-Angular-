import express from "express";
import myConnection from "./Database/dbconnection.js";
import customerRoute from './Modules/User/user.route.js';
import ProductRoute from './Modules/Product/product.route.js';
import path from "path";
import CartRoute from './Modules/Cart/cart.route.js';
import ReviewRoute from "./Modules/reviews/review.route.js";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

app.use('/customer', customerRoute);
app.use('/product', ProductRoute);
app.use("/review", ReviewRoute);
app.use('/cart',CartRoute);export const restrictUser = (req, res, next) => {
    if (req.user && req.user.status === "restricted") {
        const allowedRoutes = ["/customer/login", "/customer/profile"];

        if (allowedRoutes.includes(req.path)) {
            return next(); 
        }

        return res.status(403).json({ message: "Your account is restricted. Action not allowed." });
    }
    next();
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

myConnection

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});