import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { addToCart , removeFromCart, updateCart,getUserCart} from "./cart.controller.js"
import { getUserCartById } from "./cart.controller.js";

const CartRoute = express.Router();

//CartRoute.use(verifyToken)
CartRoute.post("/add",verifyToken,addToCart);
CartRoute.put("/update",verifyToken,updateCart);
CartRoute.delete("/remove",verifyToken,removeFromCart);
CartRoute.get('/getUserCart', verifyToken, getUserCart);
CartRoute.get("/:userId", verifyToken, getUserCartById);

export default CartRoute;