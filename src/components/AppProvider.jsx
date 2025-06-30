import React from 'react';
import { AuthProvider } from '../context/AuthContext'; // Import your AuthProvider

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      {/* Any other global providers (e.g., ThemeProvider) would go here */}
      {children}
    </AuthProvider>
  );
};

export default AppProviders;