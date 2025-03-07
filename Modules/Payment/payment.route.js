import express from 'express';
import { createPaymentIntent } from '../Payment/payment.controller.js'; 
import { verifyTokenAuth } from '../../MiddleWare/verifyTokenAuth.js'; 

const paymentRoute = express.Router();

paymentRoute.post('/createPayment', verifyTokenAuth, createPaymentIntent);

export default paymentRoute;