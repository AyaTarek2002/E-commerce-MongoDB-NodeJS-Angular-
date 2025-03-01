import { productModel } from "../../Database/Models/product.model.js";
import { catchError } from "../../MiddleWare/catchError.js";
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
    cb(null, path.resolve("images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create Product Function
const createProduct = catchError(async (req, res) => {
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

const getProductByQuery = async (req, res) => {
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
};

export { getProduct, createProduct, uploadSingleImage, getProductByQuery };
