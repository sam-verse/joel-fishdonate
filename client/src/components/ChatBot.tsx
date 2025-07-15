import { useState, useRef, useEffect } from "react";
import { User } from "@shared/schema";
import { useChat } from "../hooks/useChat";
import { useToast } from "../hooks/use-toast";

interface ChatBotProps {
  user: User | null;
}

export default function ChatBot({ user }: ChatBotProps) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { messages, isLoading, sendMessage } = useChat(user?.id);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(message, language);
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: "🌤️", text: "Weather Update", action: () => setMessage("What's the current weather for fishing?") },
    { icon: "⚖️", text: "Fishing Laws", action: () => setMessage("Tell me about fishing regulations") },
    { icon: "🌱", text: "Sustainable Practices", action: () => setMessage("How can I fish sustainably?") },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="gradient-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-comments"} text-xl`}></i>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border">
          <div className="gradient-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">AI Fishing Assistant</h3>
                <p className="text-sm opacity-90">Ask about weather, laws, or practices</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white bg-opacity-20 text-white text-xs rounded px-2 py-1 border border-white border-opacity-30"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="hi">हिंदी</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>

          <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <i className="fas fa-fish text-3xl mb-2"></i>
                <p>Start a conversation!</p>
                <div className="mt-4 space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {action.icon} {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.isUser ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-xs ${
                    msg.isUser
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt!).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-left">
                <div className="inline-block p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about weather, laws, or practices..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="gradient-primary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
