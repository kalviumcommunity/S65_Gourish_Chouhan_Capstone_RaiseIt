import { useState } from "react";
import { Button } from "../ui/button";

export default function GeminiHelper() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about RaiseIt.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setLoading(true);
    
    try {
      const res = await fetch("https://raiseit.onrender.com/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: data.reply || "Sorry, I couldn't help with that." },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="bg-white p-5 rounded-t-xl border-b border-gray-100">
        <h2 className="font-semibold text-black text-lg">Welcome</h2>
      </div>
      
      <div className="h-72 overflow-y-auto p-5 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.from === "user" 
                ? "text-right" 
                : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-xs transition-all duration-200 ${
                msg.from === "user"
                  ? "bg-gray-50 text-black shadow-sm hover:shadow-md"
                  : "bg-gray-50 text-black shadow-sm hover:shadow-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-50 text-black shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white rounded-b-xl border-t border-gray-100">
        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-black text-white hover:bg-gray-800 hover:shadow-lg transition-all duration-200 px-5 py-6 shadow-sm active:scale-95"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}