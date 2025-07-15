import { useState } from "react";
import { User } from "@shared/schema";
import { useDonations } from "../hooks/useDonations";
import { useToast } from "../hooks/use-toast";

interface DonationFormProps {
  user: User | null;
}

export default function DonationForm({ user }: DonationFormProps) {
  const [formData, setFormData] = useState({
    type: "donation",
    fishType: "",
    quantity: "",
    location: "",
    contactInfo: "",
    urgency: "medium",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createDonation } = useDonations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a donation.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fishType || !formData.quantity || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createDonation({
        userId: user.id,
        type: formData.type,
        fishType: formData.fishType,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        contactInfo: formData.contactInfo,
        urgency: formData.urgency,
        description: formData.description,
      });

      toast({
        title: "Success!",
        description: `Your ${formData.type} has been submitted successfully. We'll match you with nearby ${formData.type === "donation" ? "recipients" : "donors"}.`,
      });

      setFormData({
        type: "donation",
        fishType: "",
        quantity: "",
        location: "",
        contactInfo: "",
        urgency: "medium",
        description: "",
      });
    } catch (error: any) {
      let errorMsg = "Failed to submit donation. Please try again.";
      if (error instanceof Error && error.message) {
        errorMsg = error.message;
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to:
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="donation">Donate fish</option>
              <option value="request">Request fish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fish Type *
            </label>
            <input
              type="text"
              name="fishType"
              value={formData.fishType}
              onChange={handleChange}
              placeholder="e.g., Tuna, Salmon, Mixed"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (kg) *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low - Can wait</option>
              <option value="medium">Medium - Within a week</option>
              <option value="high">High - Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Port, or Address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Information
          </label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Phone or email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any additional information..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full gradient-primary text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Submitting...
            </span>
          ) : (
            `Submit ${formData.type === "donation" ? "Donation" : "Request"}`
          )}
        </button>
      </form>
    </div>
  );
}
