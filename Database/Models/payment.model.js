import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "customer", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: { type: String, enum: ["Success", "Failed", "Pending"], default: "Pending" },
  },
  { timestamps: true }
);

export const PaymentModel = model("Payment", paymentSchema);
