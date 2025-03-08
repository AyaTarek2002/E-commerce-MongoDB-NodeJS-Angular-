import { catchError } from "../../MiddleWare/catchError.js";
import {PromoCodeModel} from '../../Database/Models/promoCode.mode.js';

export const createPromoCode = catchError(async (req, res) => {

    const { code, discountPercentage, expiryDate, maxUsage } = req.body;

    const existingPromoCode = await PromoCodeModel.findOne({ code });
    if (existingPromoCode) {
        return res.status(400).json({ message: "Promo code already exists." });
    }

    const promoCode = await PromoCodeModel.create({
        code,
        discountPercentage,
        expiryDate,
        maxUsage
    });

    res.status(201).json({
        success: true,
        promoCode
    });
});
export const deletePromoCode = catchError(async (req, res) => {
    const promoCodeId = req.params.id; 

    const promoCode = await PromoCodeModel.findByIdAndDelete(promoCodeId);
    if (!promoCode) {
        return res.status(404).json({ message: "Promo code not found." });
    }

    res.status(200).json({
        success: true,
        message: "Promo code deleted successfully."
    });
});
export const updatePromoCode = catchError(async (req, res) => {
    const promoCodeId = req.params.id; 
    const { code, discountPercentage, expiryDate, maxUsage } = req.body;

    const promoCode = await PromoCodeModel.findByIdAndUpdate(
        promoCodeId,
        { code, discountPercentage, expiryDate, maxUsage },
        { new: true } 
    );

    if (!promoCode) {
        return res.status(404).json({ message: "Promo code not found." });
    }

    res.status(200).json({
        success: true,
        promoCode
    });
});
export const getAllPromoCodes = catchError(async (req, res) => {

    const promoCodes = await PromoCodeModel.find();
    if (!promoCodes) {
        return res.status(404).json({ message: "No promo codes found." });
        }
    res.status(200).json({
        success: true,
        promoCodes
    });
});

