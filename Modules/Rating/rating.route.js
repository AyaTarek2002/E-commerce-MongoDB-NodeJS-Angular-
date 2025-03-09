import express from "express";
import {  deleteRating, getAllRatings, getRatingByProductID, postRating} from "./rating.controller.js";
import { verifyToken } from "../../MiddleWare/verifyToken.js";

const ratingRouter = express.Router();

ratingRouter.post("/rate/:id",verifyToken,postRating);
ratingRouter.get("/getRatingByProductID/:id",getRatingByProductID);
ratingRouter.delete("/rate/:id",verifyToken,deleteRating);
ratingRouter.get("/all",getAllRatings)

export default ratingRouter;