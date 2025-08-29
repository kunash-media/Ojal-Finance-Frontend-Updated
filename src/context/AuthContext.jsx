// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';

// Create the Auth Context
export const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Update localStorage when user or isAuthenticated changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, [user, isAuthenticated]);

  // Login function to set user data and authentication status
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    console.log("context user data", userData)
  };

  // Logout function to clear user data and authentication status
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Value object to be provided to consumers
  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};