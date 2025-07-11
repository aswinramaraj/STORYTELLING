import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.gemini_api);

const generate = async (req, res) => {
  const { topic, ageGroup, language } = req.body;
  console.log("📥 Received:", { topic, ageGroup, language });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an intelligent assistant that processes one specific user-submitted topic related to technical or educational subjects.

    ONLY use the provided topic to generate your response. DO NOT generate content unrelated to the topic.
    
    Step 1: Analyze the input topic: is it valid and meaningful?
    
    Step 2: If valid, generate:
    - "title": A short, clear title (max 7 words)
    - "summary": A fun, child-friendly summary in 2–3 lines based only on the given topic
    - "category": Choose the best-fit from one of these: "Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "History", "Geography", "Statistics", or "Other"
    
    Step 3: If the topic is not valid or is too vague, respond with a suggestion on how to improve it.
    
    Respond only in **one of these two JSON formats**:
    
    If valid:
    {
      "status": "valid",
      "title": "Generated title based on the topic only",
      "summary": "A short summary based strictly on the topic.",
      "category": "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Computer Science" | "History" | "Geography" | "Statistics" | "Other"
    }
    
    If invalid:
    {
      "status": "invalid",
      "suggestion": "A helpful suggestion to improve the topic"
    }
    
    Topic: "${topic}"
    Age Group: "${ageGroup}"
    Language: "${language}"
    
    Remember: Only respond about this exact topic. Do not assume or invent new ones.`;
    
    
    
    

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

  const response = await result.response;
let text = await response.text();

// Remove code block formatting like ```json ... ```
text = text.replace(/```json|```/g, '').trim();

const analysisJSON = JSON.parse(text);

    res.status(200).json({ story: analysisJSON });
  } catch (error) {
    console.error("❌ Error generating story:", error.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
};

export { generate };
