import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy API key từ file .env (dùng Vite)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);


export async function generateRecipePrompt(prompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
