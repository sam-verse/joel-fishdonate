import { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function DemoAlertGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { refetch } = useAlerts();
  const { toast } = useToast();

  const generateDemoAlert = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/alerts/demo", {});
      const alert = await response.json();
      
      toast({
        title: "Demo Alert Generated!",
        description: `${alert.type} alert created: ${alert.message.substring(0, 50)}...`,
      });
      
      // Refresh alerts to show the new one
      refetch();
    } catch (error: any) {
      let errorMsg = "Failed to generate demo alert. Please try again.";
      if (error instanceof Error && error.message) {
        errorMsg = error.message;
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateDemoAlert}
      disabled={isGenerating}
      className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
    >
      {isGenerating ? (
        <span className="flex items-center">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Generating...
        </span>
      ) : (
        <span className="flex items-center">
          <i className="fas fa-bell mr-2"></i>
          Generate Demo Alert
        </span>
      )}
    </button>
  );
}