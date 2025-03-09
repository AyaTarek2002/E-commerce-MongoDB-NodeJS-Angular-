import {ProductSchema , ProductUpdateSchema} from "../validation/productValidation.js"
import multer from "multer";

const upload = multer(); 
const validateProduct = (schema) => (req, res, next) => {
    if (req.is("multipart/form-data")) {
        req.body = { ...req.body };
    }
    
    const { error, value } = ProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    
    req.body = value;
    next();
};
const validateData = (schema) => (req, res, next) => {
    if (req.is("multipart/form-data")) {
        req.body = { ...req.body };
    }
    
    const { error, value } = ProductUpdateSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    
    req.body = value;
    next();
};
export { upload,validateData, validateProduct };