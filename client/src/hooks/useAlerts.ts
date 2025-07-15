import { useState, useEffect } from "react";
import { Alert } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await apiRequest("GET", "/api/alerts/active");
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const createAlert = async (alertData: {
    type: string;
    message: string;
    severity: string;
    location?: string;
  }) => {
    try {
      const response = await apiRequest("POST", "/api/alerts", alertData);
      const newAlert = await response.json();
      setAlerts(prev => [newAlert, ...prev]);
      return newAlert;
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    }
  };

  const dismissAlert = async (id: number) => {
    try {
      await apiRequest("PUT", `/api/alerts/${id}`, { active: false });
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  return {
    alerts,
    isLoading,
    createAlert,
    dismissAlert,
    refetch: fetchAlerts,
  };
}
