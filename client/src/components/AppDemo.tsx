import { useState } from "react";
import { User } from "@shared/schema";
import { useAlerts } from "@/hooks/useAlerts";
import { useDonations } from "@/hooks/useDonations";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AppDemoProps {
  user: User | null;
}

export default function AppDemo({ user }: AppDemoProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const { alerts, refetch: refetchAlerts } = useAlerts();
  const { donations } = useDonations();
  const { messages } = useChat(user?.id);
  const { toast } = useToast();

  const demoActions = [
    {
      id: "chat",
      title: "AI Chat Assistant",
      description: "Test the multilingual AI chatbot for fishing communities",
      icon: "fas fa-comments",
      color: "bg-blue-500",
      action: () => {
        toast({
          title: "AI Chat Demo",
          description: "Click the chat button in the bottom right to start a conversation with our AI assistant!"
        });
      }
    },
    {
      id: "alert",
      title: "Real-time Alerts",
      description: "Generate weather and disaster alerts for fishing communities",
      icon: "fas fa-bell",
      color: "bg-red-500",
      action: async () => {
        try {
          await apiRequest("POST", "/api/alerts/demo", {});
          refetchAlerts();
          toast({
            title: "Demo Alert Generated!",
            description: "Check the top-right corner for the new alert notification."
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to generate demo alert.",
            variant: "destructive"
          });
        }
      }
    },
    {
      id: "donation",
      title: "Donation System",
      description: "View existing donations and requests from fishing communities",
      icon: "fas fa-fish",
      color: "bg-green-500",
      action: () => {
        const donationCount = donations.length;
        const pendingCount = donations.filter(d => d.status === "pending").length;
        toast({
          title: "Donation System Active",
          description: `Currently ${donationCount} donations/requests with ${pendingCount} pending matches.`
        });
      }
    },
    {
      id: "stats",
      title: "Platform Statistics",
      description: "View real-time statistics about platform usage",
      icon: "fas fa-chart-bar",
      color: "bg-purple-500",
      action: () => {
        const totalAlerts = alerts.length;
        const totalDonations = donations.reduce((sum, d) => sum + d.quantity, 0);
        const messageCount = messages.length;
        
        toast({
          title: "Platform Statistics",
          description: `${totalAlerts} active alerts, ${totalDonations}kg fish donated, ${messageCount} AI conversations.`
        });
      }
    },
    {
      id: "download",
      title: "Download Project",
      description: "Download the complete project as a ZIP file",
      icon: "fas fa-download",
      color: "bg-indigo-500",
      action: () => {
        const link = document.createElement('a');
        link.href = '/api/export/project';
        link.download = 'fish-donation-logistics-app.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: "Your complete project ZIP file is being downloaded."
        });
      }
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Interactive App Demo
      </h3>
      <p className="text-gray-600 text-center mb-6">
        Experience the key features of our Fish Donation Logistics Platform
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoActions.map((demo) => (
          <button
            key={demo.id}
            onClick={demo.action}
            className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <div className="flex items-start space-x-3">
              <div className={`${demo.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <i className={`${demo.icon} text-xl`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{demo.title}</h4>
                <p className="text-sm text-gray-600">{demo.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-white bg-opacity-70 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Current Platform Status:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{alerts.length}</div>
            <div className="text-gray-600">Active Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{donations.length}</div>
            <div className="text-gray-600">Donations/Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{messages.length}</div>
            <div className="text-gray-600">AI Conversations</div>
          </div>
        </div>
      </div>
    </div>
  );
}