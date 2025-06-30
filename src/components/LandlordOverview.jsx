import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Import axios

const LandlordOverview = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ totalProperties: 0, availableProperties: 0, rentedProperties: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchStats = async () => {
      if (authLoading || !isAuthenticated || user?.role !== 'landlord') {
        // Only fetch if authenticated landlord and auth context is loaded
        setStatsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setStatsError('Authentication token missing.');
        setStatsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/myHouses`, { // Re-using myHouses endpoint
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const houses = response.data;
        const total = houses.length;
        const available = houses.filter(house => house.status === 'available').length;
        const rented = houses.filter(house => house.status === 'rented').length;

        setStats({
          totalProperties: total,
          availableProperties: available,
          rentedProperties: rented,
        });
      } catch (err) {
        console.error('Error fetching landlord stats:', err.response?.data || err.message);
        setStatsError('Failed to load property statistics.');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [authLoading, isAuthenticated, user]); // Re-fetch if auth status or user changes

  if (authLoading) {
    return <div className="text-center p-6">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user ? user.name : 'Landlord'}!
      </h2>
      <p className="text-gray-700 text-lg mb-4">
        This is your personalized dashboard overview.
      </p>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Properties</h3>
          {statsLoading ? (
            <p className="text-2xl font-bold text-blue-600">...</p>
          ) : statsError ? (
            <p className="text-md text-red-500">Error</p>
          ) : (
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalProperties}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Available Properties</h3>
          {statsLoading ? (
            <p className="text-2xl font-bold text-green-600">...</p>
          ) : statsError ? (
            <p className="text-md text-red-500">Error</p>
          ) : (
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.availableProperties}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-700">Rented Properties</h3>
          {statsLoading ? (
            <p className="text-2xl font-bold text-purple-600">...</p>
          ) : statsError ? (
            <p className="text-md text-red-500">Error</p>
          ) : (
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.rentedProperties}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">Quick Actions:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>View your properties from the "My Properties" link in the sidebar.</li>
          <li>Add a new property using the "Add New Property" link.</li>
          <li>Check for messages from tenants or agents via the "Messages" link.</li>
          <li>Update your profile information from the "Profile" link.</li>
        </ul>
      </div>
    </div>
  );
};

export default LandlordOverview;