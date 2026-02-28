import { GoogleGenAI } from "@google/genai";
import { categories } from "@/utils/categories";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function generateProductTags(title, description) {
  const prompt = `
You are an AI product classification system.

From the predefined categories:
${categories.join(", ")}

Task:
1. Select one primary category from list.
2. Suggest subcategory.
3. Generate 5-10 SEO tags.
4. Suggest sustainability tags (plastic-free, composable, vegan, recycled, reusable, biodegradable).

IMPORTANT:
Return ONLY valid JSON.
No explanation text.

Format:
{
 "category":"",
 "subcategory":"",
 "seo_tags":[],
 "sustainability":[]
}

Product Title: ${title}
Description: ${description}
`;

  const result = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  const text = result.candidates[0].content.parts[0].text;

  return {text, prompt};
}
