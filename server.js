import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// API endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
      success: true,
    });

  } catch (err) {
    console.error("Error:", err.message);

    res.status(500).json({
      error: "Something went wrong",
      details: err.message,
      success: false,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint: POST http://localhost:${PORT}/chat`);
  console.log(`💻 Web UI: http://localhost:${PORT}`);
});
