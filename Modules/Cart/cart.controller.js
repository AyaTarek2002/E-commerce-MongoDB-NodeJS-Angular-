
import { CartModel } from "../../Database/Models/cart.model.js";  
import { productModel } from "../../Database/Models/product.model.js";  


const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;       
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        // make sure about quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        //search of product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

       
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Requested quantity exceeds available stock." });
        }

        // search of cart
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            // make new cart
            cart = new CartModel({
                userId,
                items: [{ productId, quantity, price: product.price }],
                updatedAt: new Date()
            });
        } else {
            // if product is exist elready
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, price: product.price });
            }
            cart.updatedAt = new Date();
        }

       
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully.", cart });

    } catch (error) {
        res.status(500).json({ message: "Error adding product to cart.", error: error.message });
    }
};



export {addToCart};
