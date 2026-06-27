import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const improveReview = async (req, res) => {
    try {
        const { review } = req.body;

        if (!review || !review.trim()) {
            return res.status(400).json({
                success: false,
                message: "Review text is required",
            });
        }

        const prompt = `Improve this sports ground review in a clean, natural and professional tone. Keep it short, honest, and user-friendly. Do not add fake details. Review: "${review}"`;

        let response;

        for (let i = 0; i < 3; i++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                });

                break;
            } catch (err) {
                if (i === 2) throw err;

                console.log(`Retry ${i + 1}...`);

                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        }

        res.status(200).json({
            success: true,
            improvedReview: response.text,
        });
    } catch (error) {
        console.log("Gemini Error:", error.message);

        const fallbackReview =
            "The ground was well maintained and provided a good playing experience. Overall, it was a nice place to play.";

        return res.status(200).json({
            success: true,
            improvedReview: fallbackReview,
            fallback: true,
            message: "AI unavailable, fallback review used",
        });
    }
};