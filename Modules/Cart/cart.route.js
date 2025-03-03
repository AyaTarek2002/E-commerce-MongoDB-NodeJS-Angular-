import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { addToCart } from "./cart.controller.js"

const CartRoute = express.Router();

//CartRoute.use(verifyToken)
CartRoute.post("/add",verifyToken,addToCart);
export default CartRoute;