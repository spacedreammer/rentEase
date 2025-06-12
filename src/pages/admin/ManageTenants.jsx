import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/auth/tenants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTenants(res.data);
        toast.success("Tenants loaded successfully", {
          toastId: "houses-loaded",
        });
      } catch (error) {
        console.error("Failed to load tenants:", error);
        toast.error("Failed to fetch tenants", {
          toastId: "load-fail",});
      } finally {
        setLoading(false); 
      }
    };

    fetchTenants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Tenants</h1>

      {loading ? (
        <p>Loading tenants...</p>
      ) : tenants.length === 0 ? (
        <p>No tenants found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
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
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageTenants;
