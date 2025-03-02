import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { getProduct, createProduct, uploadSingleImage  ,getProductByQuery} from "../Product/product.controller.js"; 
import { updateProductById } from "./product.controller.js"
import { deleteProductById } from "./product.controller.js"

const ProductRoute = express.Router();

ProductRoute.use(verifyToken)
ProductRoute.get("/getAllProduct", getProduct);
ProductRoute.post("/create", uploadSingleImage, createProduct);
ProductRoute.get("/getproduct", getProductByQuery);
ProductRoute.put("/update/:id",uploadSingleImage,updateProductById);
ProductRoute.delete("/delete/:id",deleteProductById);
export default ProductRoute;