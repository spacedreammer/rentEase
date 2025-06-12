// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Save user in localStorage after login

  if (!token || !user || user.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
// Usage example: