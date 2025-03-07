import express from "express";
import { addReview, getProductReviews } from "./review.controller.js";
import { verifyToken } from "../../MiddleWare/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addReview);
router.get("/:productId", getProductReviews); // أي شخص يمكنه رؤية التقييمات

export default router;
