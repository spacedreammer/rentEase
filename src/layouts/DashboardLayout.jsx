import axios from 'axios';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardLayout = ({ children, role }) => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      toast.error('Logout failed');
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 hidden md:block shadow-md">
        <h2 className="text-lg font-bold mb-6 capitalize">{role} Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <NavLink to={`/${role}`} className="hover:text-blue-600">Overview</NavLink>
          <NavLink to={`/${role}/profile`} className="hover:text-blue-600">Profile</NavLink>
          <NavLink to={`/${role}/messages`} className="hover:text-blue-600">Messages</NavLink>
          <NavLink  onClick={logout} className="hover:text-blue-600">Logout</NavLink>

            {/* Only for landlord */}
            {role === 'landlord' && (
            <NavLink to="/houselord" className="hover:text-blue-600">
              Houses to Rent
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default DashboardLayout;
