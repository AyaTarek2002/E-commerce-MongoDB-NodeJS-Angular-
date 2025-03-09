import express from 'express';
import { createOrderSummary, getOrderSummary } from '../orderHistory/order.controller.js';

const router = express.Router();

router.post('/:userId', createOrderSummary);
router.get('/:userId', getOrderSummary);

export default router;
