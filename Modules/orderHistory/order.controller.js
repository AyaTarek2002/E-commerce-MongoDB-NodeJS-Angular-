import OrderHistoryModel from '../../Database/Models/orderHistory.model.js';
import Cart from '../../Database/Models/cart.model.js';

export const createOrderSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const items = cart.items.map(item => {
            totalAmount += item.productId.price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            };
        });

        const orderSummary = new OrderHistoryModel({
            userId,
            items,
            totalAmount,
            itemCount: cart.items.length
        });

        await orderSummary.save();
        res.status(201).json(orderSummary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const items = cart.items.map(item => {
            totalAmount += item.productId.price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            };
        });

       
        const existingOrder = await OrderHistoryModel.findOne({ userId });

        if (existingOrder) {
            existingOrder.items = items;
            existingOrder.totalAmount = totalAmount;
            existingOrder.itemCount = items.length;
            await existingOrder.save();
            return res.status(200).json(existingOrder);
        }

        
        const orderSummary = new OrderHistoryModel({
            userId,
            items,
            totalAmount,
            itemCount: items.length
        });

        await orderSummary.save();
        res.status(201).json(orderSummary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
