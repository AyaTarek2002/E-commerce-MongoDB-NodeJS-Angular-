import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { catchError } from "../../MiddleWare/catchError.js";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const chatWith = catchError(async (req, res) => {
    const { prompt: userQuestion } = req.body;

    if (!userQuestion) {
        return res.status(400).json({ error: "Prompt is required." });
    }
    const allowedTopics = ["shopping", "payment", "return", "delivery", "تسوق", "دفع", "إرجاع", "توصيل"];

    const isQuestionAllowed = allowedTopics.some(topic => userQuestion.toLowerCase().includes(topic.toLowerCase()));    
    if (!isQuestionAllowed) {
        return res.json({ reply: "Sorry, this question is outside my scope of assistance." });
    }
    const isArabic = /[\u0600-\u06FF]/.test(userQuestion); 

    const context = isArabic ? `
        أنت مساعد افتراضي لموقع تسوق عبر الإنترنت. يرجى الإجابة فقط على الأسئلة المتعلقة بالتسوق.
        سياسات الموقع:
        1. يمكنك إرجاع المنتج خلال 30 يومًا.
        2. طرق الدفع المتاحة: بطاقة ائتمان، PayPal.
        3. التوصيل يستغرق من 3 إلى 5 أيام عمل.
    ` : `
        You are a virtual assistant for an online shopping website. Please answer only questions related to shopping.
        Website Policies:
        1. You can return the product within 30 days.
        2. Available payment methods: credit card, PayPal.
        3. Delivery takes 3 to 5 business days.
    `;
// ex: 
// "How can I return a product I bought from the website?"

// "What payment methods are available on your site?"

// "How long does delivery usually take?"

// "Can I change the delivery address after placing an order?"

// "What is your site's privacy policy?"

    const prompt = `${context} Question: ${userQuestion}`;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            return res.status(500).json({ error: "No response from the model." });
        }

        const response = result.response.candidates[0].content;

        res.json({ reply: response });
});
