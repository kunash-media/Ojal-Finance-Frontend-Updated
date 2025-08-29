/**
 * API endpoint constants for finance operations
 * This file contains all API endpoint URLs used in the application
 */

const ENDPOINTS = {
  // User related endpoints
  USERS: '/users',
  USERS_SEARCH: '/users/search',
  
  // Account related endpoints
  SAVINGS: '/accounts/:userId/saving',
  FIXED_DEPOSITS: '/accounts/:userId/fd',
  RECURRING_DEPOSITS: '/accounts/:userId/rd',
  LOANS: '/accounts/:userId/loan',
  
  // Report related endpoints
  REPORTS: '/reports',
  
  // Helper function to replace URL parameters
  getUrl: (endpoint, params = {}) => {
    let url = endpoint;
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
    return url;
  }
};

export default ENDPOINTS;