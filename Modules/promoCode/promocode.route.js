import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { createPromoCode ,deletePromoCode,updatePromoCode,getAllPromoCodes} from "./promocode.controller.js";
import { isAdmin } from "../../MiddleWare/checkRole.js";
const promoCodeRoute = express.Router();

promoCodeRoute.get("/getAllPromoCodes",verifyToken,isAdmin,getAllPromoCodes);
promoCodeRoute.post("/createPromoCode",verifyToken,isAdmin,createPromoCode);
promoCodeRoute.delete("/deletePromoCode/:id",verifyToken,isAdmin,deletePromoCode);
promoCodeRoute.put("/updatePromoCode/:id",verifyToken,isAdmin,updatePromoCode);


export default promoCodeRoute;



