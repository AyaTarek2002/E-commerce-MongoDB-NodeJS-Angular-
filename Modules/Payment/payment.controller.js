import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import { CartModel } from "../../Database/Models/cart.model.js";
import { productModel } from "../../Database/Models/product.model.js";
import { PaymentModel } from "../../Database/Models/payment.model.js"; 
import { userModel } from "../../Database/Models/user.model.js"; 
import {PromoCodeModel}  from "../../Database/Models/promoCode.mode.js"; 
import { catchError } from "../../MiddleWare/catchError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = catchError(async (req, res) => {
    const userId = req.user.id;
    const { products, promoCode } = req.body; 

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    if (user.status === 'restricted') {
        return res.status(403).json({ message: "You are restricted, you cannot make payments." });
    }

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: "Invalid products data." });
    }

    let totalAmount = 0;
    for (const item of products) {
        const product = await productModel.findById(item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ 
                message: `Insufficient stock for product: ${product.name}. Available stock: ${product.stock}` 
            });
        }
        totalAmount += product.price * item.quantity;
    }

    let discountAmount = 0;
    if (promoCode) {
        const promo = await PromoCodeModel.findOne({ code: promoCode });
        if (!promo) {
            return res.status(400).json({ message: "Invalid promo code." });
        }
        if (promo.expiryDate < new Date()) {
            return res.status(400).json({ message: "Promo code has expired." });
        }
        if (promo.usedCount >= promo.maxUsage) {
            return res.status(400).json({ message: "Promo code has reached its maximum usage limit." });
        }

        discountAmount = (totalAmount * promo.discountPercentage) / 100;
        totalAmount -= discountAmount;

        promo.usedCount += 1;
        await promo.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, 
        currency: 'usd',
        metadata: { userId: userId.toString() }
    });

    const paymentRecord = await PaymentModel.create({
        userId,
        products,
        amount: totalAmount,
        method: "Stripe",
        status: "Pending",
        promoCode: promoCode || null, 
        discountAmount: discountAmount 
    });

    const cart = await CartModel.findOne({ userId });
    if (cart) {
        for (const purchasedItem of products) {
            const cartItem = cart.items.find(item => 
                item.productId.toString() === purchasedItem.productId.toString()
            );
            if (cartItem) {
                cartItem.quantity -= purchasedItem.quantity;
                if (cartItem.quantity <= 0) {
                    cart.items = cart.items.filter(item => 
                        item.productId.toString() !== purchasedItem.productId.toString()
                    );
                }
            }
        }
        await cart.save();
    }

    for (const item of products) {
        const product = await productModel.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
    }

    res.status(200).json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentRecord._id,
        totalAmount: totalAmount,
        discountAmount: discountAmount
    });
});
// get all payment (admin)
export const getAllPayments = catchError(async (req, res) => {
    const payments = await PaymentModel.find({});
    res.status(200).json({ message: "All payments retrieved successfully", payments });
});

// get payment bu user id (admin)
export const getPaymentsByUserId = catchError(async (req, res) => {

    const userId = req.params.userId;
    const payments = await PaymentModel.find({ userId });

    if (!payments.length) {
        return res.status(404).json({ message: "No payments found for this user" });
    }

    res.status(200).json({ message: "User payments retrieved successfully", payments });
});