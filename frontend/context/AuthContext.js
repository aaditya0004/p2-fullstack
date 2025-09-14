

'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Our new loading state

  // This useEffect runs once when the app component mounts
  useEffect(() => {
    try {
      // Try to load user data from localStorage
      const storedUser = localStorage.getItem('ostoUser');
      const storedToken = localStorage.getItem('ostoToken');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
        console.error("Failed to parse user from local storage", error);
        // Clear out potentially corrupted storage
        localStorage.removeItem('ostoUser');
        localStorage.removeItem('ostoToken');
    }
    // Crucially, set loading to false AFTER we've checked localStorage
    setLoading(false);
  }, []);

  const login = (userData) => {
    const fullUserData = {
        _id: userData._id,
        email: userData.email,
        companyName: userData.companyName
    }
    setUser(fullUserData);
    setToken(userData.token);
    localStorage.setItem('ostoUser', JSON.stringify(fullUserData));
    localStorage.setItem('ostoToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ostoUser');
    localStorage.removeItem('ostoToken');
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
    setUser, // Expose setUser for the profile update
    loading, // Expose the loading state
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

