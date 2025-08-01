import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgentPage = () => {
  const navigate = useNavigate();
    
    const [userName, setUserName] = useState('');
   
    const url = 'http://127.0.0.1:8000/api/auth';
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      const fetchUser = async () => {
        if (!token) {
          navigate('/login');
          return;
        }
  
        try {
          const res = await axios.post(`${url}/userProfile`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(res.data.fname);
          
        } catch (error) {
          console.error('Failed to fetch user:', error.response?.data || error.message);
          navigate('/login');
        }
        
      };
  
      fetchUser();
    }, [navigate, token]);
  return (
    <DashboardLayout role={"agent"}>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Welcome Agent {userName} </h1>
        <p className="text-gray-600 mb-4">
          Manage your listings and appointments.
        </p>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-2">Your Listings</h2>
          <p className="text-sm text-gray-500">
            You haven't listed any properties yet.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentPage;
