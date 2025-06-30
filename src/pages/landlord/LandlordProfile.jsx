import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const LandlordProfile = () => {
  const { user, loading: authLoading, isAuthenticated, refreshUser } = useAuth(); // Get refreshUser to update context
  const [profileData, setProfileData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '', // Assuming you might add a phone field to your user model
    address: '', // Assuming you might add an address field
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return; // Wait for auth context to load

      if (!isAuthenticated || user?.role !== 'landlord') {
        setError('Unauthorized access. Please log in as a landlord.');
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
        const response = await axios.get(`${API_BASE_URL}/api/auth/userProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Set initial form data from fetched profile
        setProfileData({
          fname: response.data.name || '',
          lname: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '', // Make sure your API returns these if they exist
          address: response.data.address || '', // Make sure your API returns these if they exist
        });
      } catch (err) {
        console.error('Error fetching landlord profile:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load profile data.');
        toast.error('Failed to load profile data.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      // You'll need to create this backend endpoint or modify an existing one
      const response = await axios.put(`${API_BASE_URL}/api/auth/updateProfile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message || 'Profile updated successfully!');
      setIsEditing(false); // Exit edit mode
      refreshUser(); // Refresh user data in AuthContext if needed (e.g., if name changed)
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (dataLoading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fname" className="block text-sm font-medium text-gray-700">First Name:</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={profileData.fname}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full p-2 border ${isEditing ? 'border-gray-400' : 'border-gray-300 bg-gray-50'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>

        <div>
          <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Last Name:</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={profileData.lname}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full p-2 border ${isEditing ? 'border-gray-400' : 'border-gray-300 bg-gray-50'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            readOnly={!isEditing} // Email might be read-only or editable based on your auth system
            className={`mt-1 block w-full p-2 border ${isEditing ? 'border-gray-400' : 'border-gray-300 bg-gray-50'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full p-2 border ${isEditing ? 'border-gray-400' : 'border-gray-300 bg-gray-50'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            readOnly={!isEditing}
            rows="3"
            className={`mt-1 block w-full p-2 border ${isEditing ? 'border-gray-400' : 'border-gray-300 bg-gray-50'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Optionally, re-fetch profile to discard unsaved changes
                  // fetchProfile(); // Uncomment if you want to discard changes on cancel
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LandlordProfile;