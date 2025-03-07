
import { CartModel } from "../../Database/Models/cart.model.js";  
import { productModel } from "../../Database/Models/product.model.js";  
import { catchError } from "../../MiddleWare/catchError.js";

//Add Cart
// const addToCart = async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;       
//         const userId = req.user.id;
//         if (!userId) {
//             return res.status(401).json({ message: "Unauthorized. User ID is missing." });
//         }

//         if (!quantity || quantity < 1) {
//             return res.status(400).json({ message: "Quantity must be at least 1." });
//         }

//         const product = await productModel.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found." });
//         }

//         if (product.stock < quantity) {
//             return res.status(400).json({ message: "Requested quantity exceeds available stock." });
//         }

//         let cart = await CartModel.findOne({ userId });

//         if (!cart) {
//             cart = new CartModel({
//                 userId,
//                 items: [{ 
//                     productId, 
//                     quantity, 
//                     price: product.price,
//                     totalPrice: product.price * quantity 
//                 }],
//                 updatedAt: new Date()
//             });
//         } else {
//             const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

//             if (itemIndex > -1) {
//                 cart.items[itemIndex].quantity += quantity;
//                 cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * product.price;
//             } else {
//                 cart.items.push({ 
//                     productId, 
//                     quantity, 
//                     price: product.price,
//                     totalPrice: product.price * quantity
//                 });
//             }
//             cart.updatedAt = new Date();
//         }
//         await cart.save();
//         res.status(200).json({ message: "Product added to cart successfully.", cart });

//     } catch (error) {
//         res.status(500).json({ message: "Error adding product to cart.", error: error.message });
//     }
// };
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;       
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID is missing." });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Requested quantity exceeds available stock." });
        }

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({
                userId,
                items: [{ 
                    productId, 
                    quantity, 
                    price: product.price,
                    totalPrice: product.price * quantity 
                }],
                updatedAt: new Date()
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                if(cart.items[itemIndex].quantity<product.stock)
                {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * product.price;
                }else
                {
                    return res.status(400).json({ message: "Requested quantity exceeds available stock." });
                }
                
            } else {
                cart.items.push({ 
                    productId, 
                    quantity, 
                    price: product.price,
                    totalPrice: product.price * quantity
                });
            }
            cart.updatedAt = new Date();
        }
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully.", cart });

    } catch (error) {
        res.status(500).json({ message: "Error adding product to cart.", error: error.message });
    }
};
// Update Quantity in Cart 
const updateCart = catchError(
    async (req, res) => {
        const {productId , quantity} = req.body;
        const userId = req.user.id;
        if(!userId)
        {
            return res.status(401).json({message : "Unauthorized,  User ID is missing."});
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }
        // Check if product exists
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }
        //Search for the item in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Requested quantity exceeds available stock." });
        }
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = quantity * product.price;
        await cart.save();
        const updatedItem = cart.items[itemIndex];
        res.status(200).json({ 
            message: "Quantity updated successfully.", 
            updatedItem 
        });
    }
)
const removeFromCart = catchError(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized, User ID is missing." });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart." });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully.", cart });
});
const getUserCart = catchError(async (req, res) => {
    const userId = req.user.id; 

    const cart = await CartModel.findOne({ userId }).populate('items.productId');

    if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json({
        success: true,
        cart: cart
    });
});


export { addToCart , updateCart,removeFromCart,getUserCart};

