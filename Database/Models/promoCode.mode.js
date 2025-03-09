import { Schema, model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    maxUsage: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PromoCodeModel = model("PromoCode", promoCodeSchema);