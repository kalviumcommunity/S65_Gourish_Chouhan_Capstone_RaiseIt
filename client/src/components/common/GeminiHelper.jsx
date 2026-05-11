import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { sendGeminiMessage } from "../../services/api";

const suggestedQuestions = [
  "How do I raise a concern?",
  "How can I support a concern?",
  "Why should I donate using RaiseIt?",
];

export default function GeminiHelper() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about RaiseIt.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (message = input) => {
    if (!message.trim() || loading) return;
    
    const userMessage = message.trim();
    setInput("");
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setLoading(true);
    
    try {
      const data = await sendGeminiMessage(userMessage);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: data.reply || "Sorry, I couldn't help with that." },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: error.message || "Error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#fbfaf8]">
      <div className="border-b border-gray-100 bg-white px-5 py-4">
        <p className="text-sm font-medium text-gray-900">What can I help you with?</p>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          Ask about raising concerns, support, uploads, or donations.
        </p>
      </div>
      
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
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
              className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm transition-all duration-200 ${
                msg.from === "user"
                  ? "rounded-br-md bg-black text-white"
                  : "rounded-bl-md bg-white text-gray-900 ring-1 ring-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block rounded-2xl rounded-bl-md bg-white px-4 py-3 text-black shadow-sm ring-1 ring-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        {messages.length === 1 && !loading && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-gray-500">Try one of these</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60"
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 bg-white p-4">
        <div className="flex items-center gap-2 rounded-2xl bg-gray-50 p-2 ring-1 ring-gray-200 focus-within:ring-gray-400">
          <textarea
            rows={1}
            className="max-h-24 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-black placeholder-gray-500 outline-none"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <Button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="h-10 rounded-xl bg-black px-4 text-sm text-white shadow-sm transition-all duration-200 hover:bg-gray-800 disabled:bg-gray-300"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
