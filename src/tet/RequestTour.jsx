import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

// Assuming you have a way to get the user's token
const getToken = () => localStorage.getItem("token");

const RequestTour = ({ houseId }) => {
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    toast.dismiss(); // Clear any existing toasts

    if (!preferredDate) {
      toast.error("Please select a preferred date for the tour.", { toastId: "no-date" });
      setSubmitting(false);
      return;
    }

    try {
      const formattedDate = preferredDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = preferredTime || null; // Send empty string as null if no time

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/tour-requests",
        {
          house_id: houseId,
          preferred_date: formattedDate,
          preferred_time: formattedTime,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success(response.data.message || "Tour request submitted successfully!", { toastId: "tour-success" });
      // Reset form fields
      setPreferredDate(null);
      setPreferredTime("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting tour request:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit tour request. Please try again.",
        { toastId: "tour-fail" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Request a Tour</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date:
          </label>
          <DatePicker
            id="preferredDate"
            selected={preferredDate}
            onChange={(date) => setPreferredDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()} // Cannot select past dates
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            placeholderText="Select a date"
          />
        </div>

        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time (optional):
          </label>
          <input
            type="time"
            id="preferredTime"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message (optional):
          </label>
          <textarea
            id="message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 'I'm available between 2-4 PM on this date.'"></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300">
          {submitting ? "Submitting..." : "Request Tour"}
        </button>
      </form>
    </div>
  );
};

export default RequestTour;