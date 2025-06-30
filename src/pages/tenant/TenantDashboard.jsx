import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // To link to property details

const API_BASE_URL = "http://127.0.0.1:8000";

const TenantDashboard = () => {
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view your tour requests.");
          toast.error("Please log in to view your tour requests.", { toastId: "login-required" });
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/auth/tenant/tour-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTourRequests(response.data);
        toast.success("Your tour requests loaded!", { toastId: "requests-loaded" });
      } catch (err) {
        console.error("Error fetching tour requests:", err);
        setError(err.response?.data?.message || "Failed to load tour requests.");
        toast.error("Failed to load tour requests: " + (err.response?.data?.message || err.message), { toastId: "requests-fail" });
      } finally {
        setLoading(false);
      }
    };

    fetchTourRequests();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-700">Loading your tour requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Tour Requests</h1>

      {tourRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">You haven't requested any tours yet.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Browse Houses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {tourRequests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Tour for:{" "}
                    <Link to={`/house/${request.house.id}`} className="text-blue-600 hover:underline">
                      {request.house.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm">{request.house.location}</p>
                  <p className="text-gray-600 text-sm font-semibold">${request.house.price} TZS</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Preferred Date:</strong> {request.preferred_date}
                </p>
                {request.preferred_time && (
                  <p>
                    <strong>Preferred Time:</strong> {request.preferred_time}
                  </p>
                )}
                {request.message && (
                  <p>
                    <strong>Your Message:</strong> {request.message}
                  </p>
                )}
                {request.landlord && (
                    <p>
                        <strong>Landlord:</strong> {request.landlord.fname} {request.landlord.lname}
                        {request.landlord.email && ` (${request.landlord.email})`}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Requested on: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;