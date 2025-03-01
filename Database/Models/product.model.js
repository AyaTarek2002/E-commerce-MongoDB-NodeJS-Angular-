import { Schema,model } from "mongoose";

export const ProductSchema = Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number, //default 0
    category: String,
    image: String,
},
{
    timestamps: true
});
export const productModel = model('Product',ProductSchema);  //export the model