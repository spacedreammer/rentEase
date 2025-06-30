import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Authentication token not found. Please log in as Admin.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/admin/overview-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching admin overview stats:", err);
        if (err.response && err.response.status === 403) {
          setError("Access Denied: You do not have administrator privileges.");
          toast.error("Access Denied: Admin role required.");
          navigate("/login"); // Or to an unauthorized page
        } else {
          setError("Failed to load overview stats. Please try again.");
          toast.error("Failed to load stats: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-700">Loading overview stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-xl">{error}</p>
        {error.includes("Access Denied") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p className="text-xl">No stats available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">User Statistics</h2>
          <p className="text-gray-600">Total Users: <span className="font-bold text-blue-700">{stats.users.total}</span></p>
          <p className="text-gray-600">Tenants: <span className="font-bold text-green-700">{stats.users.tenants}</span></p>
          <p className="text-gray-600">Landlords: <span className="font-bold text-purple-700">{stats.users.landlords}</span></p>
          <p className="text-gray-600">Admins: <span className="font-bold text-red-700">{stats.users.admins}</span></p>
        </div>

        {/* Properties Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Property Statistics</h2>
          <p className="text-gray-600">Total Properties: <span className="font-bold text-green-700">{stats.properties.total}</span></p>
          <p className="text-gray-600">Available: <span className="font-bold text-blue-700">{stats.properties.available}</span></p>
          <p className="text-gray-600">Pending Approval: <span className="font-bold text-orange-700">{stats.properties.pending_approval}</span></p>
        </div>

        {/* Tour Requests Stats (if applicable) */}
        {stats.tour_requests && (
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Tour Request Statistics</h2>
            <p className="text-gray-600">Total Requests: <span className="font-bold text-yellow-700">{stats.tour_requests.total}</span></p>
            <p className="text-gray-600">Pending Requests: <span className="font-bold text-red-700">{stats.tour_requests.pending}</span></p>
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-600">This overview provides a quick glance at the key metrics of your RentEase platform.</p>
    </div>
  );
};

export default AdminOverview;