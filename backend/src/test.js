import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function test() {
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: "Create a roadmap for learning Node.js",
        },
      ],
    });

    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
}

test();