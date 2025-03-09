import express from 'express';
import { createPaymentIntent } from '../Payment/payment.controller.js'; 
import { verifyTokenAuth } from '../../MiddleWare/verifyTokenAuth.js'; 
import { getAllPayments, getPaymentsByUserId } from '../Payment/payment.controller.js';
import { isAdmin } from '../../MiddleWare/checkRole.js';
import { verifyToken } from '../../MiddleWare/verifyToken.js';
const paymentRoute = express.Router();

paymentRoute.post('/createPayment', verifyToken, createPaymentIntent);

paymentRoute.get("/all", verifyTokenAuth,isAdmin, getAllPayments);

paymentRoute.get("/:userId", verifyTokenAuth,isAdmin, getPaymentsByUserId);
export default paymentRoute;