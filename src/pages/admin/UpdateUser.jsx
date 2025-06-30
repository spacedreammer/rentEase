import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000";

// This component will be used for both updating and deleting any user.
const UpdateUser = ({ userId, onClose, onUserUpdated, onUserDeleted }) => { // Component name changed to UpdateUser
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    role: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // Added for button disable state

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
        const res = await axios.get(`${API_BASE_URL}/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { fname, lname, email, role, phone } = res.data;
        setForm({ fname, lname, email, role, phone: phone || "", password: "" }); // Clear password field, ensure phone defaults to empty string
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user details:", err.response?.data || err.message);
        setError("Failed to load user details.");
        toast.error("Failed to fetch user details: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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
    setSubmitting(true);
    setError(null);

    try {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password; // Don't send empty password if not changed
      }

      await axios.put(`${API_BASE_URL}/api/auth/updateUser/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User updated successfully!", { toastId: "update-success" });
      if (onUserUpdated) onUserUpdated(userId);
      // onClose is typically handled by the parent component after onUserUpdated
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
        setError(errorMessages);
        toast.error(`Validation Error: ${errorMessages}`);
      } else {
        setError("Failed to update user: " + (err.response?.data?.message || err.message));
        toast.error("Failed to update user: " + (err.response?.data?.message || err.message), { toastId: "update-failed" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      toast.error("Cannot delete: User ID is missing.", { toastId: "ID-missing" });
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/api/auth/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("User deleted successfully!", { toastId: "user-deleted" });
      if (onUserDeleted) onUserDeleted(userId);
      // onClose is typically handled by the parent component after onUserDeleted
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setError("Failed to delete user: " + (err.response?.data?.message || err.message));
      toast.error("Failed to delete user: " + (err.response?.data?.message || err.message), { toastId: "delete-failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading user details...</div>;
  }

  if (error && !form.fname) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="max-w-md bg-white p-6 rounded shadow relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      )}
      <h2 className="text-xl font-bold mb-4">Update User (ID: {userId})</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="fname"
          placeholder="First Name"
          className="w-full border px-3 py-2 rounded"
          value={form.fname}
          onChange={handleChange}
          disabled={submitting}
        />
        <input
          name="lname"
          placeholder="Last Name"
          className="w-full border px-3 py-2 rounded"
          value={form.lname}
          onChange={handleChange}
          disabled={submitting}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
          readOnly
          disabled={submitting}
        />
        <input
          name="password"
          type="password"
          placeholder="New Password (optional)"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
          disabled={submitting}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone number"
          className="w-full border px-3 py-2 rounded"
          value={form.phone}
          onChange={handleChange}
          disabled={submitting}
        />
        <select
          name="role"
          className="w-full border px-3 py-2 rounded"
          value={form.role}
          onChange={handleChange}
          disabled={submitting}>
          <option value="agent">Agent</option>
          <option value="landlord">Landlord</option>
          <option value="tenant">Tenant</option>
          <option value="admin">Admin</option> {/* Keep this option if admin can be set */}
        </select>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={submitting}>
            Update User
          </button>
          <button
            type="button"
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 disabled:opacity-50"
            onClick={handleDelete}
            disabled={submitting || (userId && parseInt(localStorage.getItem('user_id')) === userId)} // Prevent deleting self
            >
            Delete User
          </button>
          {onClose && (
            <button
              type="button"
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
              onClick={onClose}
              disabled={submitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateUser; 