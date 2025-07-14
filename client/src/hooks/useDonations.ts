import { useState, useEffect } from "react";
import { Donation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useDonations(userId?: number) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const url = userId ? `/api/donations/user/${userId}` : "/api/donations";
      const response = await apiRequest("GET", url);
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [userId]);

  const createDonation = async (donationData: {
    userId: number;
    type: string;
    fishType: string;
    quantity: number;
    location: string;
    contactInfo?: string;
    urgency: string;
    description?: string;
  }) => {
    try {
      const response = await apiRequest("POST", "/api/donations", donationData);
      const newDonation = await response.json();
      setDonations(prev => [newDonation, ...prev]);
      return newDonation;
    } catch (error) {
      console.error("Error creating donation:", error);
      throw error;
    }
  };

  const updateDonation = async (id: number, updates: Partial<Donation>) => {
    try {
      const response = await apiRequest("PUT", `/api/donations/${id}`, updates);
      const updatedDonation = await response.json();
      setDonations(prev => prev.map(d => d.id === id ? updatedDonation : d));
      return updatedDonation;
    } catch (error) {
      console.error("Error updating donation:", error);
      throw error;
    }
  };

  const deleteDonation = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/donations/${id}`);
      setDonations(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting donation:", error);
      throw error;
    }
  };

  return {
    donations,
    isLoading,
    createDonation,
    updateDonation,
    deleteDonation,
    refetch: fetchDonations,
  };
}
