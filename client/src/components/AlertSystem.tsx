import { useEffect } from "react";
import { useAlerts } from "../hooks/useAlerts";
import { notificationService } from "../lib/notifications";

export default function AlertSystem() {
  const { alerts, dismissAlert } = useAlerts();

  useEffect(() => {
    // Show browser notifications for high-severity alerts
    alerts.forEach(alert => {
      if (alert.severity === "high") {
        notificationService.showAlert(alert.message, alert.severity);
      }
    });
  }, [alerts]);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-500 text-red-800";
      case "medium":
        return "bg-yellow-50 border-yellow-500 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-500 text-blue-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather":
        return "fa-cloud-sun";
      case "disaster":
        return "fa-exclamation-triangle";
      default:
        return "fa-info-circle";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {alerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className={`notification-toast p-4 rounded-lg shadow-lg border-l-4 ${getSeverityClass(alert.severity)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className={`fas ${getTypeIcon(alert.type)} text-lg`}></i>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              {alert.location && (
                <p className="text-xs opacity-70 mt-1">📍 {alert.location}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {new Date(alert.createdAt!).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
