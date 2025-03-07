import express from 'express';
import { signUp ,resetPassword,login,forgotPassword,updateUserDetails, verifyEmail ,deleteUser,restrictUser,getUserProfile} from '../User/user.controller.js';
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
customerRoute.put('/restrict-user/:userId', verifyToken, isAdmin, restrictUser);
customerRoute.get('/profile', verifyToken, getUserProfile);
customerRoute.post("/forgot-password", forgotPassword);
customerRoute.post("/reset-password/:token", resetPassword);

export default customerRoute;