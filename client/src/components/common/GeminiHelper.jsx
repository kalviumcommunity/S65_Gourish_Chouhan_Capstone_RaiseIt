import { useState } from "react";

export default function GeminiHelper() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! Welcome to RaiseIt. Ask me anything about the site, its features, or how to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);
    try {
      const res = await fetch("https://raiseit.onrender.com/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: data.reply || "Sorry, I couldn't help with that." },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, there was an error contacting Gemini." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">🤖 Site Helper</h2>
      <div className="h-48 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.from === "bot" ? "text-blue-700" : "text-gray-800 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-blue-500">Thinking...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Ask about the site..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}