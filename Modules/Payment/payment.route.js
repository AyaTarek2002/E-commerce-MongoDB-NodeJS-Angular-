import express from 'express';
import { createPaymentIntent } from '../Payment/payment.controller.js'; 
import { verifyTokenAuth } from '../../MiddleWare/verifyTokenAuth.js'; 
import { getAllPayments, getPaymentsByUserId } from '../Payment/payment.controller.js';
const paymentRoute = express.Router();

paymentRoute.post('/createPayment', verifyTokenAuth, createPaymentIntent);

paymentRoute.get("/all", verifyTokenAuth, getAllPayments);

paymentRoute.get("/:userId", verifyTokenAuth, getPaymentsByUserId);
export default paymentRoute;