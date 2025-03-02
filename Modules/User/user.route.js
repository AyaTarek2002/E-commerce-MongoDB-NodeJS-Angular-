import express from 'express';
import { signUp ,login, verifyEmail } from '../User/user.controller.js';
import { EmailCheck } from '../../MiddleWare/EmailChecked.js';
import { validateUser } from "../../MiddleWare/validationUser.js";

const customerRoute = express.Router();

customerRoute.post('/signUp',validateUser,EmailCheck, signUp);
customerRoute.post('/login', login);
customerRoute.get("/verify/:email", verifyEmail)

export default customerRoute;