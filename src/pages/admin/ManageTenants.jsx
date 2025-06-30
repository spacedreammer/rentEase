import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateUser from "../admin/UpdateUser"; // <-- Make sure this path is correct based on where you saved UpdateUser.jsx

const API_BASE_URL = "http://127.0.0.1:8000";

const ManageTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // State to hold the ID of the user to be updated/deleted

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in as Admin.", { toastId: "auth-fail" });
        return;
      }
      // Assuming you have an admin endpoint to get tenants by role
      const res = await axios.get(`${API_BASE_URL}/api/auth/tenants`, { // Using the admin endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTenants(res.data);
      toast.success("Tenants loaded successfully!", { toastId: "tenants-loaded" });
    } catch (err) {
      console.error("Failed to load tenants:", err);
      setError("Failed to load tenants. Please try again.");
      toast.error("Failed to fetch tenants: " + (err.response?.data?.message || err.message), { toastId: "load-fail" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants(); // Initial fetch on component mount
  }, []);

  // Handler for Edit button click - opens the UpdateUser modal
  const handleEditClick = (userId) => {
    setSelectedUserId(userId);
  };

  // Handler for Delete button click - also opens the UpdateUser modal, which has the delete functionality
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
  };

  // Handler to close the UpdateUser modal
  const handleCloseUpdateForm = () => {
    setSelectedUserId(null); // Clear the selected ID to close the form/modal
  };

  // Handler to refresh the list after a user is updated or deleted
  const handleUserActionSuccess = () => {
    fetchTenants(); // Re-fetch the list of tenants to reflect changes
    handleCloseUpdateForm(); // Close the modal after action
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tenants</h1>

      {loading ? (
        <p>Loading tenants...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tenants.length === 0 ? (
        <p>No tenants found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th> {/* Assuming phone is available */}
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-t">
                <td className="px-4 py-2">
                  {tenant.fname} {tenant.lname}
                </td>
                <td className="px-4 py-2">{tenant.email}</td>
                <td className="px-4 py-2">{tenant.phone}</td> {/* Display phone */}
                <td className="px-4 py-2 capitalize">{tenant.role}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => handleEditClick(tenant.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteClick(tenant.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Render the UpdateUser component as a modal when a user is selected */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <UpdateUser
            userId={selectedUserId}
            onClose={handleCloseUpdateForm}
            onUserUpdated={handleUserActionSuccess}
            onUserDeleted={handleUserActionSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default ManageTenants;