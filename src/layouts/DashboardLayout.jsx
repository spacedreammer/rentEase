import axios from "axios";
import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom"; // Import Outlet

import { toast } from "react-toastify";

const DashboardLayout = ({ role }) => {
  const linkClass = ({ isActive }) =>
    isActive ? "text-blue-600 font-bold" : "hover:text-blue-600";
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      // Also remove role on logout for cleanliness
      localStorage.removeItem("role");
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
      <aside className="w-64 bg-gray-100 p-6 hidden md:block shadow-md">
        <h2 className="text-lg font-bold mb-6 capitalize">{role} Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink
            to={`/${role}`}
            end // Use 'end' to ensure active class only on exact path
            className={linkClass}> {/* Using the defined linkClass function */}
            Overview
          </NavLink>
          {/* General Links (for all roles that use this layout, if applicable) */}
          <NavLink
            to={`/${role}/profile`}
            className={linkClass}> {/* Using the defined linkClass function */}
            Profile
          </NavLink>
          <NavLink
            to={`/${role}/messages`}
            className={linkClass}> {/* Using the defined linkClass function */}
            Messages
          </NavLink>

          {/* Landlord Specific Links */}
          {role === "landlord" && (
            <>
              <NavLink
                to="/landlord/my-properties"
                className={linkClass}>
                My Properties
              </NavLink>
              <NavLink to="/landlord/tour-requests" className={linkClass}>
                Tenant Requests
              </NavLink>

              <NavLink
                to="/landlord/add-property"
                className={linkClass}>
                Add New Property
              </NavLink>
            </>
          )}

          {/* Admin Specific Links (if this DashboardLayout is used for admin too) */}
          {role === "admin" && (
            <>
              <NavLink to="/admin/agents" className={linkClass}>
                Manage Agents
              </NavLink>
              <NavLink to="/admin/landlords" className={linkClass}>
                Manage Landlords
              </NavLink>
              <NavLink to="/admin/tenants" className={linkClass}>
                Manage Tenants
              </NavLink>
              <NavLink to="/admin/add-user" className={linkClass}>
                Add User
              </NavLink>
            </>
          )}

          {/* Tenant Specific Links - This is the section that needs to be active for a tenant to see links */}
          {role === "tenant" && (
            <>
              <NavLink to="/tenant" end className={linkClass}>
                My Tours {/* This corresponds to the TenantDashboard overview */}
              </NavLink>
              {/* <NavLink to="/tenant/profile" className={linkClass}>
                My Profile
              </NavLink> */}
              <NavLink to="/tenant/messages" className={linkClass}>
                My Messages
              </NavLink>
            </>
          )}

          <button
            onClick={logout}
            className="w-full text-left py-2 hover:text-blue-600 focus:outline-none"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* This is crucial for rendering the child routes (like TenantDashboard) */}
      </main>
    </div>
  );
};

export default DashboardLayout;


// import axios from 'axios';
// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const DashboardLayout = ({ children, role }) => {
//   const navigate = useNavigate();
//   const logout = async () => {
//     try {
//       await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       localStorage.removeItem('token');
//       toast.success('Logged out successfully');
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed:', error.response?.data || error.message);
//       toast.error('Logout failed');
//     }
//   };
//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-100 p-6 hidden md:block shadow-md">
//         <h2 className="text-lg font-bold mb-6 capitalize">{role} Dashboard</h2>
//         <nav className="flex flex-col space-y-3">
//           <NavLink to={`/${role}`} className="hover:text-blue-600">Overview</NavLink>
//           <NavLink to={`/${role}/profile`} className="hover:text-blue-600">Profile</NavLink>
//           <NavLink to={`/${role}/messages`} className="hover:text-blue-600">Messages</NavLink>
//           <NavLink  onClick={logout} className="hover:text-blue-600">Logout</NavLink>

//             {/* Only for landlord */}
//             {role === 'landlord' && (
//             <NavLink to="/createHouse" className="hover:text-blue-600">
//               Houses to Rent
//             </NavLink>
//           )}
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 bg-gray-50">{children}</main>
//     </div>
//   );
// };

// export default DashboardLayout;
