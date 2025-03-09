import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true }, // تم التعديل من "User" إلى "customer"
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const reviewModel = mongoose.model("Review", reviewSchema);
