import OpenAI from "openai";

// ================= OPENROUTER CLIENT =================

const client = new OpenAI({

  baseURL: "https://openrouter.ai/api/v1",

  apiKey: process.env.OPENROUTER_API_KEY,

  defaultHeaders: {

    "HTTP-Referer": "http://localhost:5173",

    "X-Title": "EduPlanner",

  },

});

// ================= ROADMAP GENERATOR =================

export const generateRoadmap = async (req, res) => {

  try {

    const { topic } = req.body;

    console.log("TOPIC:", topic);

    if (!topic) {

      return res.status(400).json({

        success: false,

        message: "Topic required",

      });

    }

    const completion =
      await client.chat.completions.create({

        model: "google/gemini-2.0-flash-001",

        messages: [

          {

            role: "user",

            content: `
Create a structured study roadmap for "${topic}".

Return ONLY raw valid JSON.

IMPORTANT:
- Do NOT use markdown
- Do NOT write explanations
- Do NOT add text before or after JSON
- Do NOT use \`\`\`json

Format:
[
  {
    "title": "",
    "level": "Beginner | Intermediate | Advanced",
    "duration": "",
    "priority": "High | Medium | Low",
    "description": ""
  }
]
            `,

          },

        ],

      });

    let text =
      completion.choices[0].message.content;

    console.log("RAW AI RESPONSE:", text);

    // Remove markdown if AI still sends it
    text =
      text.replace(/```json|```/g, "").trim();

    // Safety check
    if (!text.startsWith("[")) {

      return res.status(500).json({

        success: false,

        message:
          "AI did not return valid JSON array",

        raw: text,

      });

    }

    let parsed;

    try {

      parsed = JSON.parse(text);

    } catch (parseError) {

      console.log(
        "JSON PARSE ERROR:",
        parseError
      );

      return res.status(500).json({

        success: false,

        message: "AI returned invalid JSON",

        raw: text,

      });

    }

    res.status(200).json({

      success: true,

      steps: parsed,

    });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({

      success: false,

      message: "AI generation failed",

      error: error.message,

    });

  }

};

// ================= QUIZ GENERATOR =================

export const generateQuiz = async (req, res) => {

  try {

    const { topic } = req.body;

    console.log("QUIZ TOPIC:", topic);

    if (!topic) {

      return res.status(400).json({

        success: false,

        message: "Topic required",

      });

    }

    const completion =
      await client.chat.completions.create({

        model: "google/gemini-2.0-flash-001",

        messages: [

          {

            role: "user",

            content: `
Generate 5 multiple choice questions for "${topic}".

Return ONLY raw valid JSON.

IMPORTANT:
- Do NOT use markdown
- Do NOT write explanations
- Do NOT add text before or after JSON
- Do NOT use \`\`\`json

Format:
[
  {
    "question": "What is DBMS?",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 1"
  }
]
            `,

          },

        ],

      });

    let text =
      completion.choices[0].message.content;

    console.log("RAW QUIZ RESPONSE:", text);

    text =
      text.replace(/```json|```/g, "").trim();

    if (!text.startsWith("[")) {

      return res.status(500).json({

        success: false,

        message:
          "AI did not return valid JSON array",

        raw: text,

      });

    }

    let parsed;

    try {

      parsed = JSON.parse(text);

    } catch (parseError) {

      console.log(
        "QUIZ JSON ERROR:",
        parseError
      );

      return res.status(500).json({

        success: false,

        message:
          "AI returned invalid quiz JSON",

        raw: text,

      });

    }

    res.status(200).json({

      success: true,

      quiz: parsed,

    });

  } catch (error) {

    console.error("QUIZ ERROR:", error);

    res.status(500).json({

      success: false,

      message: "Quiz generation failed",

      error: error.message,

    });

  }

};

// ================= AI CHATBOT =================

export const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({

        success: false,

        message: "Message is required",

      });

    }

    console.log("AI CHAT MESSAGE:", message);

    const completion =
      await client.chat.completions.create({

        model: "google/gemini-2.0-flash-001",

        messages: [

          {

            role: "system",

            content: `
You are EduPlanner AI Assistant.

You help students with:
- studying
- productivity
- roadmaps
- coding
- exams
- motivation
- learning strategies

Keep responses:
- smart
- concise
- supportive
- easy to understand
            `,

          },

          {

            role: "user",

            content: message,

          },

        ],

      });

    const reply =
      completion.choices[0].message.content;

    res.status(200).json({

      success: true,

      reply,

    });

  } catch (error) {

    console.error(
      "CHATBOT ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "AI chatbot failed",

      error: error.message,

    });

  }

};