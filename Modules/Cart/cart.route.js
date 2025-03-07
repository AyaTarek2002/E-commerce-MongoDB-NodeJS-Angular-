import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { addToCart , removeFromCart, updateCart} from "./cart.controller.js"

const CartRoute = express.Router();

//CartRoute.use(verifyToken)
CartRoute.post("/add",verifyToken,addToCart);
CartRoute.put("/update",verifyToken,updateCart);
CartRoute.post("/remove",verifyToken,removeFromCart);
export default CartRoute;