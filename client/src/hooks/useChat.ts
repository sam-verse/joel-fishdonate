import { useState, useEffect } from "react";
import { ChatMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useChat(userId?: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const url = userId ? `/api/chat/messages?userId=${userId}` : "/api/chat/messages";
      const response = await apiRequest("GET", url);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const sendMessage = async (message: string, language: string = "en") => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/chat/send", {
        message,
        userId,
        language,
      });
      const aiResponse = await response.json();
      
      // Refresh messages to get the latest
      await fetchMessages();
      
      return aiResponse;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    refetch: fetchMessages,
  };
}
