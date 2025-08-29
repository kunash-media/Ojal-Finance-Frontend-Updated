import { useState, useEffect } from 'react';

/**
 * API service for finance operations
 * This file contains methods to interact with the finance API endpoints
 */

// Base API URL - should be configured from environment variables
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Create a savings account for a user
 * @param {string} userId - The ID of the user
 * @param {Object} savingData - Data for creating the savings account
 * @returns {Promise} - Promise with the API response
 */
export const createSavingAccount = async (userId, savingData) => {
  try {
    const response = await fetch(`${BASE_URL}/accounts/${userId}/saving`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savingData)
    });

    if (!response.ok) {
      throw new Error('Failed to create saving account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating saving account:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise} - Promise with the list of users
 */
export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Search users by criteria
 * @param {string} searchTerm - The search term
 * @param {string} searchType - The field to search on (name, mobile, etc.)
 * @returns {Promise} - Promise with the search results
 */
export const searchUsers = async (searchTerm, searchType) => {
  try {
    const response = await fetch(`${BASE_URL}/users/search?term=${searchTerm}&type=${searchType}`);
    
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Custom hook for managing users data
 * @returns {Object} - Users data and methods to manipulate it
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default {
  createSavingAccount,
  getUsers,
  searchUsers,
  useUsers
};