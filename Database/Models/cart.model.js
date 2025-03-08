import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  { 
    userId: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {  
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true } 
);

export const CartModel = model("Cart", CartSchema);
export default CartModel;