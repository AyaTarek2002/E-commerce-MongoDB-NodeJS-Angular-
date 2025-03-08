
import { productModel } from "../../Database/Models/product.model.js";
import { catchError } from "../../MiddleWare/catchError.js";
import { ProductUpdateSchema } from "../../validation/productValidation.js";
import multer from "multer";
import path from "path";

const getProduct = catchError(
async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  if (req.user.role === "admin") {
      const allProducts = await productModel.find();
      res.status(200).json({ message: "All Products: ", allProducts });
  } else {
      res.status(403).json({ message: "Forbidden: Only admins can access this resource" });
  }
});
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// Create Product Function
const createProduct = catchError(async (req, res) => {
  console.log(req.file);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Only admins can create products." });
  }

  if (!req.file || !req.file.filename) {
    return res.status(400).json({ message: "No image uploaded!" });
  }
  const existingProduct = await productModel.findOne({
    name: req.body.name,
    category: req.body.category,
});

if (existingProduct) {
    return res.status(400).json({ message: "Product already exists with the same name and category." });
}

  req.body.createdBy = userId;
  req.body.image = `/images/${req.file.filename}`; 

  const newProduct = await productModel.create(req.body);
  res.status(201).json({ message: "Product created successfully", newProduct });
});
// Middleware for handling single image upload
const uploadSingleImage = upload.single("image");

const getProductByQuery = catchError(async (req, res) => {
  try {
      const { name, price } = req.query;

      let query = {};
      if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive search
      if (price) query.price = price;

      const products = await productModel.find(query);

      if (products.length === 0) {
          return res.status(404).json({ message: "No products found." });
      }

      return res.status(200).json({ products });
  } catch (error) {
      return res.status(500).json({ message: "Server error.", error: error.message });
  }
});
// Edit product by id
const updateProductById = catchError(async (req, res) => {
  let productId = req.params.id;
  let updatedProduct = await productModel.findOne({ _id: productId });

  if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
  }

  if (req.user.role === "admin") {
      const { error, value } = ProductUpdateSchema.validate(req.body, { abortEarly: false });
      if (error) {
          return res.status(400).json({ message: "Validation error", errors: error.details });
      }

      if (req.file) {
          value.image = `/images/${req.file.filename}`;
      }

      if (value.stock !== undefined) {
          updatedProduct.stock = value.stock;
      }

      updatedProduct = await productModel.findByIdAndUpdate(productId, value, { new: true });
      res.json({ message: "Updated product", updatedProduct });
  } else {
      res.json({ message: "Not allowed to update" });
  }
});
// delete product by id
const deleteProductById = catchError(async (req, res) => {
  let productId = req.params.id;
  let product = await productModel.findOne({ _id: productId });

  if (!product) {
      return res.status(404).json({ message: "Product not found" });
  }

  if (req.user.role === "admin") {
      await productModel.findByIdAndDelete(productId);
      res.json({ message: "Deleted product successfully" });
  } else {
      res.json({ message: "Not allowed to delete" });
  }
});


export { getProduct, createProduct, uploadSingleImage, getProductByQuery,updateProductById ,deleteProductById};
