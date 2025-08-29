import { useAuth } from './AuthContext';
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
// import { data } from 'react-router-dom';

// Create the User Context
export const UserContext = createContext();

// Custom hook to use the User Context
export const useUsers = () => {
  return useContext(UserContext);
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  /**
   * Fetches users from backend based on role from authenticated user
   * @param {string} role - The role to filter users by
   */
  const fetchUsers = async (role) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (role === 'SUPER_ADMIN') {
        // Call the existing API for SUPER_ADMIN
        response = await axios.get(
          'http://localhost:8080/api/users/get-all-users',
          { params: { role } }
        );
      } else {
        // Call the branch-specific API for other roles
        response = await axios.get(
          `http://localhost:8080/api/users/get-all-branch?branchName=${authUser?.branchName || ''}`
        );
      }
      
      console.log("user data fetched :", response.data);
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes the user list with current role from auth
   */
  const refreshUsers = () => {
    if (authUser?.role) {
      fetchUsers(authUser.role);
    }
  };

  // Automatically fetch users when authUser changes
  useEffect(() => {
    if (authUser?.role) {
      fetchUsers(authUser.role);
    }
  }, [authUser]);

  // Value object to be provided to consumers
  const value = {
    users,
    loading,
    error,
    refreshUsers,
    fetchUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};