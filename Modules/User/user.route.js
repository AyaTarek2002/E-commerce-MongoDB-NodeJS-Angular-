import express from 'express';
import { signUp ,login,updateUserDetails, verifyEmail ,deleteUser} from '../User/user.controller.js';
import { EmailCheck } from '../../MiddleWare/EmailChecked.js';
import { validateUser , validateData } from "../../MiddleWare/validationUser.js";
import { verifyToken } from '../../MiddleWare/verifyToken.js';
import { isAdmin } from '../../MiddleWare/checkRole.js';
const customerRoute = express.Router();

customerRoute.post('/signUp',validateUser,EmailCheck, signUp);
customerRoute.post('/login', login);
customerRoute.put('/updateUserDetails',verifyToken,validateData,EmailCheck,updateUserDetails);
customerRoute.delete('/deleteUser/:id',verifyToken, isAdmin, deleteUser);
customerRoute.get("/verify/:email", verifyEmail)

export default customerRoute;