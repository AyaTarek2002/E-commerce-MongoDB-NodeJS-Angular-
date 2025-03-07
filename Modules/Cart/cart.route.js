import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { restrictUser } from "../../MiddleWare/restrictUser.js"; 

import { addToCart,getCart} from "./cart.controller.js"

const CartRoute = express.Router();

CartRoute.use(verifyToken)
CartRoute.post("/add",verifyToken,restrictUser,addToCart);
CartRoute.get("/getCart", verifyToken, getCart);

export default CartRoute;

