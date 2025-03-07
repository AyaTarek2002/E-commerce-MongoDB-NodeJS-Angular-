import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
import { CartModel } from "../../Database/Models/cart.model.js";
import { productModel } from "../../Database/Models/product.model.js";
import { PaymentModel } from "../../Database/Models/payment.model.js"; 
import { userModel } from "../../Database/Models/user.model.js"; 
import { catchError } from "../../MiddleWare/catchError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = catchError(async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    if (user.status === 'restricted') {
        return res.status(403).json({ message: "You are restricted, you cannot make payments." });
    }

    const cart = await CartModel.findOne({ userId }); 
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty." });
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.totalPrice, 0);

    for (const item of cart.items) {
        const product = await productModel.findById(item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for product: ${product.name}.` });
        }
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, 
        currency: 'usd',
        metadata: { userId: userId.toString() }
    });

    const paymentRecord = await PaymentModel.create({
        userId,
        amount: totalAmount,
        method: "Stripe",
        status: "Pending"
    });
 
    for (const item of cart.items) {
        const product = await productModel.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
    }

    await CartModel.findOneAndDelete({ userId });

    res.status(200).json({ 
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentRecord._id
    });
});