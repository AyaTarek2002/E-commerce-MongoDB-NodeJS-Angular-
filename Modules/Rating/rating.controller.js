import express from "express";
import { productModel } from "../../Database/Models/product.model.js";

const postRating = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id; 
        const { rating, comment } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        if (!rating) {
            return res.status(400).json({ message: "Rating is required" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingRating = product.ratings.find((r) => r.userId.toString() === userId.toString());
        if (existingRating) {
            return res.status(400).json({ message: "You have already rated this product" });
        }

        product.ratings.push({ userId, rating, comment });

        const totalRatings = product.ratings.length;
        const sumRatings = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        product.averageRating = sumRatings / totalRatings;

        await product.save();

        res.status(200).json({ message: "Rating added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getRatingByProductID=async(req,res)=>{
    const productId=req.params.id;
    

   
    const product = await productModel.findById(productId).populate("ratings.userId", "name email") ;
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({mesaage: "Ratings retrieved successfully",product });
}



const deleteRating = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id; 

               const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const ratingIndex = product.ratings.findIndex(rating => rating.userId.toString() === userId.toString());
        if (ratingIndex === -1) {
            return res.status(400).json({ message: "You have not rated this product yet" });
        }

        product.ratings.splice(ratingIndex, 1);

       
        if (product.ratings.length > 0) {
            const totalRatings = product.ratings.length;
            const sumRatings = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            product.averageRating = sumRatings / totalRatings;
        } else {
            product.averageRating = 0;
        }

        await product.save();

        console.log("✅ Rating deleted successfully!");
        res.status(200).json({ message: "Rating deleted successfully", product });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getAllRatings = async (req, res) => {
    try {
        const productsWithRatings = await productModel.find({ "ratings.0": { $exists: true } })
            .populate("ratings.userId", "name email")
            .select("name ratings averageRating"); 

        if (productsWithRatings.length === 0) {
            return res.status(404).json({ message: "No ratings found" });
        }

        res.status(200).json({
            message: "All ratings retrieved successfully",
            products: productsWithRatings
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export { postRating,getRatingByProductID,deleteRating,getAllRatings };
