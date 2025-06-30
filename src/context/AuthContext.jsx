import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:8000/api/auth";

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("AuthContext: checkAuthStatus initiated on mount/refresh.");
      const token = localStorage.getItem('token');

      if (token) {
        console.log("AuthContext: Token found in localStorage:", token.substring(0, 30) + '...'); // Log first 30 chars
        try {
          const response = await axios.get(`${API_BASE_URL}/userProfile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
          setUser(response.data);
          console.log("AuthContext: User re-authenticated successfully:", response.data);
          toast.success("Welcome back!"); // Or a subtle message
        } catch (error) {
          console.error("AuthContext: Re-authentication failed (likely 401).", error.response?.data || error.message);
          // Only remove token if the error is specifically due to authentication failure (401, 403)
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            toast.error("Your session has expired or is invalid. Please log in again.");
            navigate('/login'); // Redirect to login page
          } else {
            // Handle other types of errors (e.g., network issues, 500s from other endpoints)
            toast.error("Failed to re-authenticate due to an unexpected error.");
            // Don't remove token or redirect for generic errors right away
          }
        }
      } else {
        console.log("AuthContext: No token found in localStorage.");
        setIsAuthenticated(false);
        setUser(null); // Ensure user is null if no token
      }
      setLoading(false);
      console.log("AuthContext: checkAuthStatus completed. isAuthenticated:", isAuthenticated, "user:", user); // Note: state might not be updated in this exact log
    };
    checkAuthStatus();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const login = (token, userData = null) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData); // Set user immediately if data is provided by login endpoint
    toast.success("Logged in successfully!");
    console.log("AuthContext: Login function called. Token set.");
    if (!userData) {
      // If login endpoint doesn't return user data, fetch it
      console.log("AuthContext: User data not provided on login, fetching userProfile.");
      // You might want to call checkAuthStatus here directly or just fetchUserProfile
      // For simplicity, let's call fetchUserProfile
      const fetchUserProfile = async () => {
        try {
            const fetchedToken = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/userProfile`, {
                headers: { Authorization: `Bearer ${fetchedToken}` }
            });
            setUser(response.data);
            console.log("AuthContext: UserProfile fetched after login:", response.data);
        } catch (error) {
            console.error("AuthContext: Failed to fetch user profile after login:", error);
            // Even if profile fetch fails, user is still 'authenticated' by token for now
        }
      };
      fetchUserProfile();
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    console.log("AuthContext: Logout initiated.");
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("AuthContext: Logout API call successful.");
      }
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      console.error("AuthContext: Logout failed (API error).", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Logout failed");
      // Even if API logout fails, clear local storage and state for UX
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  if (loading) {
    // You can replace this with a spinner or a loading screen
    return <div>Loading authentication status...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};