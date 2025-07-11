
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.gemini_api);

const generatestory  = async (req, res) => {
    const { topic, ageGroup, language, title, description, valid } = req.body;
    console.log("📥 Received:", { topic, ageGroup, language, title, description, valid });

   try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a creative AI that turns educational topics into fun, engaging stories for children.

You will be given:
- A topic (can be history, science, or technology)
- An age group (example: 8-10)
- A language (like Tamil, English)

🎯 Your task:
1. **Create a fictional story** with **characters, imagination, and fun**, not just plain explanation. Help kids understand the topic without knowing it’s a lesson.
2. **Avoid sounding like a textbook or Wikipedia.**
3. **Make it kid-friendly, simple, visual, and magical.**
4. Include **conversations**, **actions**, or **fun events** around the topic.

🎬 Then, generate a **video_script** – break the story into short lines for animation (1 line per scene).

💡 Example format (respond only in raw JSON):
{
  "story": "your full storytelling content",
  "video_script": ["line 1", "line 2", "line 3", ...]
}

Now generate a story using:
- Topic: "${topic}"
- Age Group: "${ageGroup}"
- Language: "${language}"

Make sure the story reflects all three inputs and is entertaining yet educational.`;


    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

  const response = await result.response;
let text = await response.text();

// Remove code block formatting like ```json ... ```

let text1 = text.replace(/```json|```/g, '').trim();
console.log(text1)
const analysisJSON = text1;

    res.status(200).json({ story: analysisJSON });
  } catch (error) {
    console.error("❌ Error generating story:", error.message);
    res.status(500).json({ error: "Failed to generate story" });
  }

};
export { generatestory };