"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "bot"; text: string }[]>([
    // Optional welcome message
    { role: "bot", text: "Hello! I'm your AI support assistant. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMsg = async () => {
    if (!msg.trim() || loading) return;

    const userMsg = msg.trim();
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I'm having trouble responding right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  const suggestions = [
    "Where is my order?",
    "Return policy",
    "Product warranty",
    "Contact support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8">
          {/* Header inside card */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              AI Customer Support
            </h1>
            <p className="text-white/80">
              Ask me anything about orders, products, or policies
            </p>
          </div>

          {/* Chat Messages Area */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 h-[400px] overflow-y-auto mb-4 space-y-4">
            {chat.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                  } shadow-md`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setMsg(suggestion);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-4 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/50 transition"
              disabled={loading}
            />
            <button
              onClick={sendMsg}
              disabled={loading || !msg.trim()}
              className="bg-black text-white px-6 rounded-xl font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Floating Home Button (optional but consistent) */}
      <Link href="/">
        <div className="fixed bottom-6 right-6 bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:bg-gray-900 hover:scale-110 transition-all duration-200 cursor-pointer">
          🏠
        </div>
      </Link>
    </div>
  );
}