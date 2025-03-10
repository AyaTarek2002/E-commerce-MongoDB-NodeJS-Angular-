import mongoose from 'mongoose';

const orderSummarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    itemCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OrderHistoryModel = mongoose.model('OrderSummary', orderSummarySchema);
export default OrderHistoryModel;
