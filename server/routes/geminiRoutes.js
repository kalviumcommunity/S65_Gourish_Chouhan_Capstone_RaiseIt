const express = require("express");
const axios = require("axios");
const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const SYSTEM_PROMPT = `You are RaiseIt Assistant, the helpful guide for the RaiseIt platform.

RaiseIt is a community-focused platform where people can raise public concerns, explain issues clearly, add supporting details, gather support, discuss solutions, and help important problems get noticed. The goal is to turn scattered complaints into organized community action.

Core message:
- RaiseIt gives users a simple place to speak up about real issues.
- Users should use RaiseIt because a clearly written concern with community support is easier to understand, share, and act on.
- Support/upvotes and comments help show which issues matter to people.
- Donations help sustain and improve the platform so more concerns can be surfaced, organized, and supported.
- RaiseIt aims to be a trustworthy platform by keeping the experience clear, user-focused, and transparent. Do not claim certifications, partnerships, impact numbers, or guarantees unless the user explicitly provides them.

Answer style:
- Sound human, calm, and confident.
- Keep answers simple, clever, and useful.
- Prefer 2-4 short sentences unless the user asks for steps.
- When explaining donations, focus on supporting the platform mission, keeping the service useful, and helping community voices get better tools.
- Do not overpromise outcomes. Say RaiseIt helps concerns get organized and visible, not that every issue will be solved.
- Do not invent fake references, statistics, NGOs, policies, awards, or verification claims.
- If asked how to use the app, give practical steps.
- If asked unrelated questions, answer briefly if possible and guide back to RaiseIt.

Current app capabilities:
- Sign up and log in.
- Browse community concerns.
- Raise a concern with title, description, tags, and optional image.
- View concern details.
- Support concerns.
- Add comments.
- Explore donation options.

The developer of the app is Gourish Chouhan.`;

function getLocalReply(message) {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey|namaste)\b/.test(text)) {
    return "Hi! I can help you use RaiseIt, create concerns, browse community issues, or understand donations.";
  }

  if (text.includes("concern") || text.includes("issue") || text.includes("raise")) {
    return "To raise a concern, sign in, open Concerns, choose Raise a Concern, add a clear title, description, optional tags, and submit it.";
  }

  if (text.includes("login") || text.includes("signup") || text.includes("account")) {
    return "Use the Auth page to create an account or log in. After login, RaiseIt stores your session token locally so you can create and interact with concerns.";
  }

  if (text.includes("donat") || text.includes("payment") || text.includes("razorpay")) {
    return "Donating supports RaiseIt's mission: helping more people turn real concerns into clear, visible community action. A trusted platform needs continued care, better tools, and a smooth experience for everyone using it.";
  }

  if (text.includes("community") || text.includes("discussion") || text.includes("group")) {
    return "Community discussions help people move from simply reporting a concern to talking through context, support, and possible next steps together.";
  }

  if (text.includes("upload") || text.includes("image")) {
    return "Images can make a concern easier to understand. Add a relevant photo or evidence when raising a concern so others can quickly see what is happening.";
  }

  return "I can help with RaiseIt features: signing in, raising concerns, commenting, supporting concerns, image uploads, and donations. What would you like to do?";
}

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!geminiApiKey) {
      return res.json({ reply: getLocalReply(message), source: "local" });
    }

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          { parts: [{ text: `${SYSTEM_PROMPT}\n\nUser question: ${message.trim()}` }] },
        ],
      },
      { timeout: 20000 }
    );
    const reply =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";
    res.json({ reply, source: "gemini" });
  } catch (err) {
    const apiMessage = err.response?.data?.error?.message;
    console.warn("Gemini fallback:", apiMessage || err.message);
    res.json({
      reply: getLocalReply(message),
      source: "local",
      warning: process.env.NODE_ENV === "production" ? undefined : apiMessage || err.message,
    });
  }
});

module.exports = router;
