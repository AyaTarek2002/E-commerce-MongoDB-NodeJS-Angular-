import { reviewModel } from "../../Database/Models/review.model.js";
import { userModel } from "../../Database/Models/user.model.js";
import { productModel } from "../../Database/Models/product.model.js";
import { catchError } from "../../MiddleWare/catchError.js";

export const addReview = catchError(async (req, res) => {
    const { productId, comment } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "User not found! Please register first." });
    }

    if (user.role === "admin") {
        return res.status(403).json({ message: "Admins cannot add reviews!" });
    }

    if (user.status === "restricted") {
        return res.status(403).json({ message: "You are restricted and cannot add reviews." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found!" });
    }

    const review = await reviewModel.create({
        user: userId,
        product: productId,
        comment
    });

    res.status(201).json({ message: "Review added successfully!", review });
});

export const deleteReview = catchError(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await reviewModel.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found!" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "User not found!" });
    }

    // 🔹 يمكن للـ admin أو صاحب المراجعة حذفها
    if (review.user.toString() !== userId && user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to delete this review!" });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully!" });
});

// 📌 جلب كل التقييمات الخاصة بمنتج معين
export const getProductReviews = catchError(async (req, res) => {
    const { productId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found!" });
    }

    const reviews = await reviewModel.find({ product: productId })
        .populate("user", "name email") 
        .sort({ createdAt: -1 });

    res.status(200).json({ message: "Product reviews retrieved successfully!", reviews });
});


