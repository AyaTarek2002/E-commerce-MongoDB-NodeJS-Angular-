import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { addToCart , removeFromCart, updateCart,getUserCart,getUserCartById} from "./cart.controller.js"
import { isAdmin } from '../../MiddleWare/checkRole.js';

const CartRoute = express.Router();

//CartRoute.use(verifyToken)
CartRoute.post("/add",verifyToken,addToCart);
CartRoute.put("/update",verifyToken,updateCart);
CartRoute.delete("/remove",verifyToken,removeFromCart);
CartRoute.get('/getUserCart', verifyToken, getUserCart);
CartRoute.get("/:userId", verifyToken,isAdmin, getUserCartById);

export default CartRoute;