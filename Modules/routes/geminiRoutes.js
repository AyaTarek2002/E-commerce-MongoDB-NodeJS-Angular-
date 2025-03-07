import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { catchError } from "../../MiddleWare/catchError.js";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

export const chatWith = catchError(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            return res.status(500).json({ error: "No response from the model." });
        }

        const response = result.response.candidates[0].content;

        res.json({ reply: response });
});
