import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // For redirection after update

const API_BASE_URL = "http://127.0.0.1:8000"; // Ensure this matches your Laravel backend URL

const TenantProfile = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "", // For password validation
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Effect to fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("You must be logged in to view your profile.");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/userProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUser({
          fname: userData.fname || "",
          lname: userData.lname || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: "", // Password fields are never pre-filled for security
          password_confirmation: "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to load profile: " + (err.response?.data?.message || err.message));
        // Redirect to login if unauthorized or forbidden
        if (err.response?.status === 401 || err.response?.status === 403) {
            navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // navigate is a dependency to ensure useEffect runs if it changes (though it's usually stable)

  // Handler for input field changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    // Clear any existing error for the field being changed
    setErrors({ ...errors, [e.target.name]: null });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors on new submission attempt

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    // Construct data to send to the backend
    // Only include password fields if they are both filled (indicating user wants to change password)
    const dataToUpdate = {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
    };

    // Password validation logic before sending to backend
    if (user.password || user.password_confirmation) {
        if (user.password !== user.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: "Passwords do not match." }));
            toast.error("Passwords do not match.");
            return;
        }
        if (user.password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters." }));
            toast.error("Password must be at least 6 characters.");
            return;
        }
        dataToUpdate.password = user.password;
        dataToUpdate.password_confirmation = user.password_confirmation;
    } else {
       
        delete dataToUpdate.password;
        delete dataToUpdate.password_confirmation;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/api/auth/updateProfile`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || "Profile updated successfully!");
      setErrors({}); // Clear any previous errors on success
      // Clear password fields after successful update for security
      setUser(prev => ({ ...prev, password: "", password_confirmation: "" }));
    } catch (err) {
      console.error("Error updating profile:", err);
      // Handle validation errors from Laravel
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        // Display the first validation error message to the user
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        toast.error(err.response.data.errors[firstErrorKey][0]);
      } else {
        toast.error("Failed to update profile: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Show a full-page loading indicator only if initial data is not yet loaded
  if (loading && Object.keys(user).every(key => user[key] === "")) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="fname" className="block text-gray-700 text-sm font-bold mb-2">
            First Name:
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={user.fname}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.fname ? 'border-red-500' : '' // Red border for errors
            }`}
          />
          {errors.fname && <p className="text-red-500 text-xs italic">{errors.fname}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lname" className="block text-gray-700 text-sm font-bold mb-2">
            Last Name:
          </label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={user.lname}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.lname ? 'border-red-500' : ''
            }`}
          />
          {errors.lname && <p className="text-red-500 text-xs italic">{errors.lname}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone:
          </label>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
        </div>

        {/* Password Change Section (Optional) */}
        <div className="border-t pt-4 mt-4">
          <p className="text-lg font-semibold text-gray-800 mb-2">Change Password (optional):</p>
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password:
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={user.password_confirmation}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password_confirmation ? 'border-red-500' : ''
              }`}
            />
            {errors.password_confirmation && <p className="text-red-500 text-xs italic">{errors.password_confirmation}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loading} // Disable button while loading/submitting
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantProfile;