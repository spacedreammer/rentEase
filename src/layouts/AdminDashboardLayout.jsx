import axios from "axios";
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboardLayout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",

        {}, // No body needed for logout
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink to="/admin" className="hover:text-cyan-400">
            Overview
          </NavLink>
          <NavLink to="/admin/agents" className="hover:text-cyan-400">
            Manage Agents
          </NavLink>
          <NavLink to="/admin/landlords" className="hover:text-cyan-400">
            Manage Landlords
          </NavLink>
          <NavLink to="/admin/tenants" className="hover:text-cyan-400">
            Manage Tenants
          </NavLink>
          <NavLink to="/admin/add-user" className="hover:text-cyan-400">
            Add Agent/Landlord
          </NavLink>
          <NavLink onClick={logout} className="hover:text-cyan-400">
            Logout
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
