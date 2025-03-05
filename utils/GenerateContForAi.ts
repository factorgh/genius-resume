import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"; // GPT-4 API endpoint

export const generateContentForAi = async (prompt: any) => {
  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7, // Adjust creativity level (0 is more strict, 1 is creative)
        max_tokens: 1000, // Limit the response length
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error generating content.";
  }
};
