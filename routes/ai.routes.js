const router = require("express").Router();
const axios = require("axios");
const verifyToken = require("../middleware/verifyToken");

const instructions =
  "You are the HelpDesk Pro IT assistant for company employees. " +
  "Help with IT problems like Wi-Fi, printers, passwords, software and hardware. " +
  "Give short, simple, numbered steps. " +
  "If the steps do not fix the problem, tell the employee to create a support ticket. " +
  "Use plain text only, without markdown symbols like * or #. " +
  "If the question is not about IT, politely say you only help with IT problems.";

router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "Please type a message" });
    }

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`,
      {
        systemInstruction: { parts: [{ text: instructions }] },
        contents: messages.map((oneMessage) => ({
          role: oneMessage.role,
          parts: [{ text: oneMessage.text }],
        })),
      },
      {
        headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
      }
    );

    const reply = geminiResponse.data.candidates[0].content.parts[0].text;

    return res.json({ reply: reply });
  } catch (err) {
    console.log(err?.response?.data || err);
    return res.status(500).json({ message: "The AI assistant is not available right now" });
  }
});

module.exports = router;
