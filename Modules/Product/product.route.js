import express from "express";
import { verifyToken } from "../../MiddleWare/verifyToken.js";
import { getProduct, createProduct, uploadSingleImage  ,getProductByQuery,updateProductById,deleteProductById} from "../Product/product.controller.js"; 
import { ProductSchema, ProductUpdateSchema } from "../../validation/productValidation.js";
import {validateProduct ,validateData} from "../../MiddleWare/validationProduct.js"; 
const ProductRoute = express.Router();

ProductRoute.get("/getAllProduct",verifyToken, getProduct);
ProductRoute.post("/create",verifyToken, uploadSingleImage,validateProduct(ProductSchema),createProduct);
ProductRoute.get("/getproduct",verifyToken, getProductByQuery);
ProductRoute.put("/update/:id",verifyToken,uploadSingleImage,validateData(ProductUpdateSchema),updateProductById);
ProductRoute.delete("/delete/:id",verifyToken,deleteProductById);
export default ProductRoute;