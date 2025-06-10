const express = require("express");
const axios = require("axios");
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT =
  "You are a helpful assistant for the RaiseIt website, created to assist with questions about its features, navigation, and usage, while also handling basic greetings and simple inquiries like the current date or weather. RaiseIt is a dynamic platform fostering community interaction for voicing concerns, seeking advice, and engaging in discussions, with a mission to address personal and public issues through shared insights and collaborative solutions. The developer of the app is Gourish Chouhan. Maintain a helpful and respectful tone, providing detailed responses for RaiseIt-related questions and brief answers for basic inquiries. Politely redirect complex or extended discussions on external topics back to RaiseIt. Your primary goal is to guide users in navigating and utilizing the RaiseIt platform effectively.";

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: SYSTEM_PROMPT }] },
          { parts: [{ text: message }] },
        ],
      }
    );
    const reply =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: "Gemini API error", error: err.message });
  }
});

module.exports = router;