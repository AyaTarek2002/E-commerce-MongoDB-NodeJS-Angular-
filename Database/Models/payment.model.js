import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "customer", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, enum: ["Success", "Failed", "Pending"], default: "Pending" },
  },
  { timestamps: true }
);

export const PaymentModel = model("Payment", paymentSchema);
