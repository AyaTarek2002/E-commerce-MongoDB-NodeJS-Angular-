// router.post("/chat",
import express from "express";
import { chatWith} from "./geminiRoutes.js"

const ChatRoute = express.Router();
ChatRoute.post("/chat", chatWith);
export default ChatRoute;


