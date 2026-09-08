import dotenv from "dotenv";
dotenv.config();

export const config = {
    googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    model: process.env.ARC_MODEL || "gemini-3.5-flash-lite",
    maxOutputTokens:500
}