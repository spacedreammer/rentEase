import axios from "axios";
import React, { useState, useEffect } from "react"; // <-- Import useEffect
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000";

// This component will be used for both updating and deleting a user.
// It receives `userId` (or landlordId/tenantId) and an `onSuccess` callback.
const UpdateLandlord = ({ userId, onClose, onUserUpdated, onUserDeleted }) => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    role: "", // Will be pre-filled from fetched user data
    phone: "",
    password: "", // Password is often handled separately or not pre-filled for security
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch user data when the component mounts or userId changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setLoading(false);
        setError("User ID not provided.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // GET request to fetch specific user details
        const res = await axios.get(`${API_BASE_URL}/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

       
        const { fname, lname, email, role, phone } = res.data;
        setForm({ fname, lname, email, role, phone, password: "" }); // Clear password field
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user details:", err.response?.data || err.message);
        setError("Failed to load user details.");
        toast.error("Failed to fetch user details: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Re-run effect if userId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Cannot update: User ID is missing.");
      return;
    }

    try {
      // PUT request to update user details
      await axios.put(`${API_BASE_URL}/api/auth/updateUser/${userId}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User updated successfully!", {
        toastId: "update-success"
      });
      if (onUserUpdated) onUserUpdated(userId); // Callback for successful update
      if (onClose) onClose(); // Close the form/modal
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Failed to update user: " + (err.response?.data?.message || err.message),  {
        toastId: "update-failed"
      });
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      toast.error("Cannot delete: User ID is missing.",  {
        toastId: "ID-missing"
      });
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      // DELETE request to delete user
      await axios.delete(`${API_BASE_URL}/api/auth/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User deleted successfully!",  {
        toastId: "user-deleted"
      });
      if (onUserDeleted) onUserDeleted(userId); // Callback for successful deletion
      if (onClose) onClose(); // Close the form/modal
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Failed to delete user: " + (err.response?.data?.message || err.message), {
        toastId: "delete-failed"
      });
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update User (ID: {userId})</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="fname"
          placeholder="First Name"
          className="w-full border px-3 py-2 rounded"
          value={form.fname}
          onChange={handleChange}
        />

        <input
          name="lname"
          placeholder="Last Name"
          className="w-full border px-3 py-2 rounded"
          value={form.lname}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
          readOnly // Often, email is not editable or requires special handling
        />
        {/* Password field for update - usually optional or separate */}
        <input
          name="password"
          type="password"
          placeholder="New Password (optional)"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone number"
          className="w-full border px-3 py-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full border px-3 py-2 rounded"
          value={form.role}
          onChange={handleChange}>
          <option value="agent">Agent</option>
          <option value="landlord">Landlord</option>
          <option value="tenant">Tenant</option> {/* Added tenant role */}
          {/* Add other roles if applicable, e.g., 'admin' if allowed to change */}
        </select>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Update User
          </button>
          <button
            type="button"
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            onClick={handleDelete}>
            Delete User
          </button>
          {onClose && (
            <button
              type="button"
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
              onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateLandlord;