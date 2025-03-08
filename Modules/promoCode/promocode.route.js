import express from "express";
import { verifyTokenAuth } from "../../MiddleWare/verifyTokenAuth.js";
import { createPromoCode ,deletePromoCode,updatePromoCode,getAllPromoCodes} from "./promocode.controller.js";
import { isAdmin } from "../../MiddleWare/checkRole.js";
const promoCodeRoute = express.Router();

promoCodeRoute.get("/getAllPromoCodes",verifyTokenAuth,isAdmin,getAllPromoCodes);
promoCodeRoute.post("/createPromoCode",verifyTokenAuth,isAdmin,createPromoCode);
promoCodeRoute.delete("/deletePromoCode/:id",verifyTokenAuth,isAdmin,deletePromoCode);
promoCodeRoute.put("/updatePromoCode/:id",verifyTokenAuth,isAdmin,updatePromoCode);


export default promoCodeRoute;



