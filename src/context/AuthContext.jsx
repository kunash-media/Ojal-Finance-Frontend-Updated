import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create the Auth Context
export const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to calculate 24-hour expiry timestamp
  const getExpiryTimestamp = () => Date.now() + 24 * 60 * 60 * 1000;

  // Initialize state from localStorage if available and not expired
  const initializeAuthState = () => {
    const savedUser = localStorage.getItem('user');
    const savedIsAuth = localStorage.getItem('isAuthenticated') === 'true';
    const savedExpiry = localStorage.getItem('sessionExpiry');

    console.log('Initializing auth state:', { savedUser, savedIsAuth, savedExpiry }); // Debug log

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
    console.log('Updating localStorage:', { user, isAuthenticated, expiry }); // Debug log
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
    console.log('Checking session validity:', { isAuthenticated, user, expiry, currentTime: Date.now(), pathname: location.pathname }); // Debug log
    if (!isAuthenticated || !user || !expiry || Date.now() >= expiry) {
      if (location.pathname !== '/' && location.pathname !== '/signup') {
        console.log('Session invalid, logging out and redirecting to /'); // Debug log
        logout();
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, expiry, navigate, location.pathname]);

  // Login function to set user data, authentication status, and 24hr expiry
  const login = (userData) => {
    console.log('Login called with:', userData); // Debug log
    setUser(userData);
    setIsAuthenticated(true);
    const newExpiry = getExpiryTimestamp();
    setExpiry(newExpiry);
    console.log("context user data", userData);
  };

  // Logout function to clear user data and authentication status
  const logout = () => {
    console.log('Logout called'); // Debug log
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