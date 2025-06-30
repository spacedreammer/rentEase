import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // For linking to house details

const API_BASE_URL = "http://127.0.0.1:8000";

const LandlordTourRequests = () => {
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // To track which request is being acted upon

  useEffect(() => {
    fetchLandlordTourRequests();
  }, []);

  const fetchLandlordTourRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required to view tour requests.");
        toast.error("Please log in as a landlord to view requests.", { toastId: "login-landlord" });
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/auth/landlord/tour-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTourRequests(response.data);
      toast.success("Tour requests loaded successfully!", { toastId: "requests-loaded" });
    } catch (err) {
      console.error("Error fetching landlord tour requests:", err);
      setError(err.response?.data?.message || "Failed to load tour requests.");
      toast.error("Failed to load tour requests: " + (err.response?.data?.message || err.message), { toastId: "requests-fail" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, actionType) => {
    setActionLoading(requestId); // Set loading state for this specific request
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required to perform this action.");
      setActionLoading(null);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/tour-requests/${requestId}/${actionType}`, // e.g., /accept or /reject
        {}, // Empty body for simple POST
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || `Request ${actionType}ed successfully!`, { toastId: `action-${actionType}` });
      // Update the status of the specific request in the local state
      setTourRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: response.data.tour_request.status } : req
        )
      );
    } catch (err) {
      console.error(`Error ${actionType}ing tour request:`, err);
      toast.error(err.response?.data?.message || `Failed to ${actionType} request.`, { toastId: `action-fail-${actionType}` });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-700">Loading tenant requests...</p>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tenant Tour Requests for My Properties</h1>

      {tourRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">No tour requests found for your properties yet.</p>
          <Link to="/landlord/add-property" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            List a New Property
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
                  <p className="text-gray-600 text-sm">
                    Located at: {request.house.location} (${request.house.price} / month)
                  </p>
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
                  <strong>Requested by:</strong> {request.tenant.fname} {request.tenant.lname}
                  {request.tenant.email && ` (${request.tenant.email})`}
                  {request.tenant.phone && ` | ${request.tenant.phone}`}
                </p>
                <p>
                  <strong>Preferred Date:</strong> {request.preferred_date}
                  {request.preferred_time && ` at ${request.preferred_time}`}
                </p>
                {request.message && (
                  <p>
                    <strong>Tenant's Message:</strong> {request.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Submitted on: {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>

              {request.status === 'pending' && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleAction(request.id, 'accept')}
                    disabled={actionLoading === request.id}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                  >
                    {actionLoading === request.id ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleAction(request.id, 'reject')}
                    disabled={actionLoading === request.id}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                  >
                    {actionLoading === request.id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordTourRequests;