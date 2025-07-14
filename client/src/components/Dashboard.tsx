import { useState } from "react";
import { User, Donation, Alert } from "@shared/schema";
import { useDonations } from "@/hooks/useDonations";
import { useAlerts } from "@/hooks/useAlerts";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { donations, isLoading: donationsLoading } = useDonations(user.id);
  const { alerts } = useAlerts();

  const totalDonated = donations
    .filter(d => d.type === "donation")
    .reduce((sum, d) => sum + d.quantity, 0);
  
  const activeDonations = donations.filter(d => d.status === "pending").length;
  const completedDonations = donations.filter(d => d.status === "completed").length;
  const estimatedPeopleFed = Math.floor(totalDonated / 2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "matched":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  if (donationsLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <i className="fas fa-spinner fa-spin text-2xl text-primary"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Track your contributions and impact</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="gradient-primary text-white p-6 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-fish text-3xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold">{totalDonated}</p>
              <p className="text-sm opacity-90">kg Donated</p>
            </div>
          </div>
        </div>

        <div className="gradient-alt text-white p-6 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-clock text-3xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold">{activeDonations}</p>
              <p className="text-sm opacity-90">Active Requests</p>
            </div>
          </div>
        </div>

        <div className="gradient-blue text-white p-6 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-3xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold">{completedDonations}</p>
              <p className="text-sm opacity-90">Completed</p>
            </div>
          </div>
        </div>

        <div className="gradient-ocean text-white p-6 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-heart text-3xl mr-4"></i>
            <div>
              <p className="text-2xl font-bold">{estimatedPeopleFed}</p>
              <p className="text-sm opacity-90">People Fed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "donations"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Donations
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "alerts"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Alerts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {donations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-fish text-primary mr-3"></i>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{donation.fishType}</p>
                          <p className="text-xs text-gray-500">
                            {donation.quantity}kg - {donation.location}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Impact Summary</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <i className="fas fa-heart text-red-500 text-2xl mb-2"></i>
                      <p className="text-lg font-bold text-gray-900">Lives Impacted</p>
                      <p className="text-3xl font-bold text-green-600">{estimatedPeopleFed}</p>
                      <p className="text-sm text-gray-600">Estimated people fed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="space-y-4">
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-fish text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-500">No donations yet. Start making a difference!</p>
                </div>
              ) : (
                donations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg">{donation.fishType}</h4>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            donation.type === "donation" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {donation.type}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">
                          {donation.quantity}kg - {donation.location}
                        </p>
                        <p className={`text-sm font-medium ${getUrgencyColor(donation.urgency)}`}>
                          {donation.urgency.charAt(0).toUpperCase() + donation.urgency.slice(1)} Priority
                        </p>
                        {donation.description && (
                          <p className="text-sm text-gray-500 mt-2">{donation.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(donation.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-bell text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-500">No active alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-l-4 p-4 rounded-lg ${
                      alert.severity === "high"
                        ? "border-red-500 bg-red-50"
                        : alert.severity === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start">
                      <i
                        className={`fas ${
                          alert.type === "weather"
                            ? "fa-cloud-sun"
                            : alert.type === "disaster"
                            ? "fa-exclamation-triangle"
                            : "fa-info-circle"
                        } text-lg mr-3 mt-1`}
                      ></i>
                      <div className="flex-1">
                        <p className="font-medium">{alert.message}</p>
                        {alert.location && (
                          <p className="text-sm opacity-70 mt-1">📍 {alert.location}</p>
                        )}
                        <p className="text-sm opacity-70 mt-1">
                          {new Date(alert.createdAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
