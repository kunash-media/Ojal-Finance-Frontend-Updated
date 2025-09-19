import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the Auth Context
export const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // Helper to calculate 24-hour expiry timestamp
  const getExpiryTimestamp = () => Date.now() + 24 * 60 * 60 * 1000;

  // Initialize state from localStorage if available and not expired
  const initializeAuthState = () => {
    const savedUser = localStorage.getItem('user');
    const savedIsAuth = localStorage.getItem('isAuthenticated') === 'true';
    const savedExpiry = localStorage.getItem('sessionExpiry');

    if (savedUser && savedIsAuth && savedExpiry) {
      const expiryTimestamp = parseInt(savedExpiry, 10);
      if (Date.now() < expiryTimestamp) {
        return {
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          expiry: expiryTimestamp
        };
      }
    }

    // If expired or invalid, clear storage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionExpiry');

    return {
      user: null,
      isAuthenticated: false,
      expiry: null
    };
  };

  const initialState = initializeAuthState();
  const [user, setUser] = useState(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [expiry, setExpiry] = useState(initialState.expiry);

  // Update localStorage when user, isAuthenticated, or expiry changes
  useEffect(() => {
    if (user && isAuthenticated && expiry) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('sessionExpiry', expiry.toString());
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('sessionExpiry');
    }
  }, [user, isAuthenticated, expiry]);

  // Check session validity and redirect to login if invalid
  useEffect(() => {
    if (!isAuthenticated || !user || !expiry || Date.now() >= expiry) {
      logout();
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, expiry, navigate]);

  // Login function to set user data, authentication status, and 24hr expiry
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    const newExpiry = getExpiryTimestamp();
    setExpiry(newExpiry);
    console.log("context user data", userData);
  };

  // Logout function to clear user data and authentication status
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setExpiry(null);
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