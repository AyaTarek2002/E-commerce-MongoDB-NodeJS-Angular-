import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { getProduct, createProduct, uploadSingleImage  ,getProductByQuery} from "../Product/product.controller.js";
import { validateProduct } from "../../MiddleWare/validationProduct.js"
const ProductRoute = express.Router();

ProductRoute.use(verifyToken)
ProductRoute.get("/getAllProduct", getProduct);
ProductRoute.post("/create",validateProduct, uploadSingleImage, createProduct);
ProductRoute.get("/getproduct", getProductByQuery);

export default ProductRoute;