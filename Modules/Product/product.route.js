import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { getProduct, createProduct, uploadSingleImage } from "../Product/product.controller.js";

const ProductRoute = express.Router();

ProductRoute.get("/getAllProduct", verifyToken, getProduct);
ProductRoute.post("/create", verifyToken, uploadSingleImage, createProduct);

export default ProductRoute;