import express from "express";
import { addReview, getProductReviews,deleteReview } from "./review.controller.js";
import { verifyToken } from "../../MiddleWare/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addReview);
router.delete("/:reviewId",verifyToken,deleteReview); 
router.get("/:productId", getProductReviews);

export default router;
