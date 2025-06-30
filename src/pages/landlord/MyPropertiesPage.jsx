// src/pages/MyPropertiesPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MyPropertiesPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [myHouses, setMyHouses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchMyHouses = async () => {
      if (loading) return;

      if (!isAuthenticated || user?.role !== 'landlord') {
        setError('You must be logged in as a landlord to view your properties.');
        setDataLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setDataLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/myHouses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyHouses(response.data);
      } catch (err) {
        console.error('Error fetching landlord houses:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load your properties.');
        toast.error('Failed to load your properties.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchMyHouses();
  }, [loading, isAuthenticated, user]);

  const handleDelete = async (houseId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) { // Stronger confirmation
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/auth/deleteHouse/${houseId}`, { // Correct delete endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message || 'Property deleted successfully!');
      setMyHouses(myHouses.filter(house => house.id !== houseId));
    } catch (err) {
      console.error('Error deleting house:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to delete property. Please try again.');
    }
  };


  if (dataLoading) {
    return <div className="text-center p-6">Loading your properties...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Properties</h2>

      {myHouses.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">You haven't listed any properties yet.</p>
          <Link to="/landlord/add-property" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myHouses.map((house) => (
            <div key={house.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Display first image or a placeholder */}
              {house.images && house.images.length > 0 ? (
                <img
                  src={`${API_BASE_URL}${house.images[0]}`}
                  alt={house.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{house.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{house.location}</p>
                <p className="text-purple-700 font-bold mt-2">${house.price} / month</p>
                <p className="text-gray-700 mt-2 text-sm">
                  {house.bedrooms} Beds | {house.bathrooms} Baths | {house.size} sqft
                </p>
                <p className={`mt-2 text-sm font-medium ${house.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {house.status}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    to={`/landlord/edit-property/${house.id}`} 
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(house.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;