import { Schema,model } from "mongoose";

export const ProductSchema = Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number, //default 0
    category: String,
    image: String,
    ratings:[
        {
            userId:{
                type:Schema.Types.ObjectId,
                ref:"customer",
                required:true,
            },
            rating:{
                type:Number,
                required:true,
                min:1,
                max:5,
            },
            comment:String,
        },
    ],
    averageRating:{
        type:Number,
        default:0,
    },
},
{
    timestamps: true
});
export const productModel = model('Product',ProductSchema);  //export the model
export default productModel;