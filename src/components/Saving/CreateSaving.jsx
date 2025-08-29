import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';

function CreateSaving() {

  const { users, loading, error, refreshUsers } = useUsers();
  const { user } = useAuth();

  const [filteredUsers, setFilteredUsers] = useState([]);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null); // NEW: Store account number for deletion

  const [currentUserId, setCurrentUserId] = useState(null);

  const branchName = user?.branchName || "NA";
  const [adminBranch, setAdminBranch] = useState(branchName);

  const [currentUserAccountStatus, setCurrentUserAccountStatus] = useState(null);
  const [savingData, setSavingData] = useState({
    interestRate: "",
    minimumBalance: "",
    initialDeposit: ""
  });

  // Optimized state management - single source of truth for user accounts
  const [userAccountsMap, setUserAccountsMap] = useState(new Map());
  const [accountsLoading, setAccountsLoading] = useState(false);

  /**
   * Optimized function to fetch user accounts data
   * Reduces API calls by batching requests and caching results
   */
  const fetchUserAccountsData = useCallback(async () => {
    if (!adminBranch || adminBranch === "NA" || !users || users.length === 0) {
      setUserAccountsMap(new Map());
      return;
    }

    setAccountsLoading(true);
    const accountsMap = new Map();

    try {
      console.log('Fetching user accounts data for branch:', adminBranch);

        // UPDATED: Get branch-specific users first - handle SUPER_ADMIN case
        const branchUsers = user?.role === 'SUPER_ADMIN' 
        ? users  // For SUPER_ADMIN, use all users without branch filtering
        : users.filter(user => user.branch === adminBranch);  // For other roles, filter by branch

      // Check each user for existing savings account
      const accountCheckPromises = branchUsers.map(async (user) => {
        try {
          const response = await fetch(`http://localhost:8080/api/saving/get-by-userId/${user.userId}`);

          if (response.ok) {
            const accountData = await response.json();
            // Store the complete account data for the user
            accountsMap.set(user.userId, {
              hasAccount: true,
              accountData: accountData,
              accountNumber: accountData.accountNumber,
              interestRate: accountData.interestRate,
              minimumBalance: accountData.minimumBalance,
              initialDeposit: accountData.initialDeposit
            });
          } else if (response.status === 404) {
            // User doesn't have an account
            accountsMap.set(user.userId, {
              hasAccount: false,
              accountData: null
            });
          }
        } catch (err) {
          console.warn(`Error checking account for user ${user.userId}:`, err);
          // Assume no account on error
          accountsMap.set(user.userId, {
            hasAccount: false,
            accountData: null
          });
        }
      });

      // Wait for all account checks to complete
      await Promise.all(accountCheckPromises);

      setUserAccountsMap(accountsMap);
      console.log('User accounts map updated:', accountsMap);

    } catch (err) {
      console.error('Error fetching user accounts data:', err);
      toast.error('Failed to fetch user accounts data');
      setUserAccountsMap(new Map());
    } finally {
      setAccountsLoading(false);
    }
  }, [adminBranch, users, user?.role]); // UPDATED: Added user?.role to dependencies

  // Fetch user accounts data when branch or users change
  useEffect(() => {
    fetchUserAccountsData();
  }, [fetchUserAccountsData]);

  /**
   * Filter and sort users for display
   * Priority: Users without accounts first (sorted by newest), then users with accounts (sorted by newest)
   */
  useEffect(() => {
    if (users && users.length > 0) {
      // Filter users by branch first
      
      const branchUsers = users?.role === 'SUPER_ADMIN' ? users : users.filter(user => user.branch === adminBranch);
      console.log("super admin debugging :", branchUsers);

      // Sort users: those without accounts first, then those with accounts
      // Within each group, sort by creation date (newest first)
      const sortedUsers = branchUsers.sort((a, b) => {
        const aAccountInfo = userAccountsMap.get(a.userId);
        const bAccountInfo = userAccountsMap.get(b.userId);

        const aHasAccount = aAccountInfo?.hasAccount || false;
        const bHasAccount = bAccountInfo?.hasAccount || false;

        // Users without accounts come first
        if (!aHasAccount && bHasAccount) return -1;
        if (aHasAccount && !bHasAccount) return 1;

        // For users in the same category, sort by creation date (newest first)
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });

      setFilteredUsers(sortedUsers);
    }
  }, [users, userAccountsMap, adminBranch, users?.role]);

  /**
   * Debounced search function to improve performance
   */
  const debouncedSearch = useCallback(
    debounce((term, type) => {
      if (!users || users.length === 0) return;

      // UPDATED: Filter users by branch first - handle SUPER_ADMIN case
      let branchUsers = user?.role === 'SUPER_ADMIN' 
        ? users  // For SUPER_ADMIN, use all users without branch filtering
        : users.filter(user => user.branch === adminBranch);  // For other roles, filter by branch

      // Apply search filter
      if (term.trim()) {
        branchUsers = branchUsers.filter(user => {
          let value = '';
          if (type === 'name') {
            value = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.toLowerCase();
          } else if (type === 'mobile') {
            value = user.mobile?.toLowerCase() || '';
          }

          return value.includes(term.toLowerCase());
        });
      }

      // search Sorting users: those without accounts first, then those with accounts.
      const sortedUsers = branchUsers.sort((a, b) => {
        const aAccountInfo = userAccountsMap.get(a.userId);
        const bAccountInfo = userAccountsMap.get(b.userId);

        const aHasAccount = aAccountInfo?.hasAccount || false;
        const bHasAccount = bAccountInfo?.hasAccount || false;

        // Users without accounts come first
        if (!aHasAccount && bHasAccount) return -1;
        if (aHasAccount && !bHasAccount) return 1;

        // For users in the same category, sort by creation date (newest first)
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });

      setFilteredUsers(sortedUsers);
    }, 500),
    [users, userAccountsMap, adminBranch, users?.role] // UPDATED: Added user?.role to dependencies
  );

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchTerm, searchType);
  }, [searchTerm, searchType, debouncedSearch]);

  /**
   * Handle saving account form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSavingData({
      ...savingData,
      [name]: value
    });
  };

  /**
   * Open modal for adding saving account
   */
  const handleAddSaving = (userId) => {
    console.log('Adding saving account for user:', userId);
    setCurrentUserId(userId);
    setCurrentUserAccountStatus(null);
    setSavingData({
      interestRate: "",
      minimumBalance: "",
      initialDeposit: ""
    });
    setIsModalOpen(true);
  };

  /**
  * Enhanced form validation with better null/empty checks
  */
  // Enhanced form validation (replace your handleSubmit):
  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim whitespace and validate all fields are filled
    const interestRateStr = savingData.interestRate?.toString().trim();
    const minimumBalanceStr = savingData.minimumBalance?.toString().trim();
    const initialDepositStr = savingData.initialDeposit?.toString().trim();

    // Check for empty strings, null, or undefined
    if (!interestRateStr || interestRateStr === '' ||
      !minimumBalanceStr || minimumBalanceStr === '' ||
      !initialDepositStr || initialDepositStr === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    // Parse and validate numeric values
    const interestRate = parseFloat(interestRateStr);
    const minimumBalance = parseFloat(minimumBalanceStr);
    const initialDeposit = parseFloat(initialDepositStr);

    if (isNaN(interestRate) || isNaN(minimumBalance) || isNaN(initialDeposit)) {
      toast.error('Please enter valid numeric values');
      return;
    }

    if (interestRate < 0 || minimumBalance < 0 || initialDeposit < 0) {
      toast.error('Values cannot be negative');
      return;
    }

    // Additional validation for reasonable ranges
    if (interestRate > 100) {
      toast.error('Interest rate cannot exceed 100%');
      return;
    }

    if (minimumBalance > 1000000) {
      toast.error('Minimum balance seems too high');
      return;
    }

    // if (initialDeposit < minimumBalance) {
    //   toast.error('Initial deposit must be at least equal to minimum balance');
    //   return;
    // }

    setIsModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  /**
   * Handle confirmation for both create and update
   */
  const handleConfirmAction = async () => {
    if (currentUserAccountStatus === 'EXISTS') {
      await handleUpdateConfirm();
    } else {
      await handleConfirm();
    }
  };

  /**
   * FIXED: Proper BigDecimal payload creation to prevent null scale errors
   * This addresses the "Cannot read field 'scale' because 'val' is null" error
   */

  // Replace your handleConfirm function with this:
  const handleConfirm = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/accounts/${currentUserId}/saving`;

      // Parse to numbers and validate
      const interestRate = parseFloat(savingData.interestRate);
      const minimumBalance = parseFloat(savingData.minimumBalance);
      const initialDeposit = parseFloat(savingData.initialDeposit);

      // Validate parsed numbers
      if (isNaN(interestRate) || isNaN(minimumBalance) || isNaN(initialDeposit)) {
        throw new Error('All fields must be valid numbers');
      }

      // Create payload with numbers (not strings)
      const payload = {
        interestRate: interestRate,      // Send as number
        minimumBalance: minimumBalance,  // Send as number  
        initialDeposit: initialDeposit   // Send as number
      };

      console.log('Creating saving account for user:', currentUserId);
      console.log('POST API URL:', apiUrl);
      console.log('Payload:', payload);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error('Could not parse error response:', textError);
          }
        }

        throw new Error(`Failed to create saving account: ${errorMessage}`);
      }

      const data = await response.json();
      handleSuccessResponse(data, payload);

    } catch (error) {
      console.error('Error creating saving account:', error);
      setIsConfirmModalOpen(false);

      const errorMessage = error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  /**
   * Helper function to handle successful response
   */
  const handleSuccessResponse = (data, usedPayload) => {
    console.log('Account created successfully:', data);

    setIsConfirmModalOpen(false);
    toast.success('Saving account created successfully!');

    // Update the accounts map immediately for instant UI update
    setUserAccountsMap(prev => {
      const newMap = new Map(prev);
      newMap.set(currentUserId, {
        hasAccount: true,
        accountData: {
          accountNumber: data.accountNumber,
          interestRate: parseFloat(usedPayload.interestRate),
          minimumBalance: parseFloat(usedPayload.minimumBalance),
          initialDeposit: parseFloat(usedPayload.initialDeposit)
        },
        accountNumber: data.accountNumber
      });
      return newMap;
    });

    // Reset form data
    setSavingData({
      interestRate: "",
      minimumBalance: "",
      initialDeposit: ""
    });
  };

  // Replace your handleUpdateConfirm function with this:
  const handleUpdateConfirm = async () => {
    try {
      const updateApiUrl = `http://localhost:8080/api/saving/update-by-userId/${currentUserId}`;

      // Parse to numbers and validate
      const interestRate = parseFloat(savingData.interestRate);
      const minimumBalance = parseFloat(savingData.minimumBalance);
      const initialDeposit = parseFloat(savingData.initialDeposit);

      if (isNaN(interestRate) || isNaN(minimumBalance) || isNaN(initialDeposit)) {
        throw new Error('All fields must be valid numbers');
      }

      // Send as numbers (not strings)
      const payload = {
        interestRate: interestRate,
        minimumBalance: minimumBalance,
        initialDeposit: initialDeposit
      };

      console.log('Updating saving account for user:', currentUserId);
      console.log('PATCH API URL:', updateApiUrl);
      console.log('Update payload:', payload);

      const response = await fetch(updateApiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update API Error Response:', errorText);
        throw new Error(`Failed to update saving account: ${errorText}`);
      }

      const data = await response.json();
      handleUpdateSuccessResponse(data, payload);

    } catch (error) {
      setIsConfirmModalOpen(false);
      toast.error('Failed to update saving account: ' + error.message);
      console.error('Error updating saving account:', error);
    }
  };

  /**
   * Helper function to handle successful update response
   */
  const handleUpdateSuccessResponse = (data, usedPayload) => {
    console.log('Account updated successfully:', data);

    setIsConfirmModalOpen(false);
    toast.success('Saving account updated successfully!');

    // Update the accounts map immediately for instant UI update
    setUserAccountsMap(prev => {
      const newMap = new Map(prev);
      const existingAccount = newMap.get(currentUserId);
      newMap.set(currentUserId, {
        ...existingAccount,
        accountData: {
          ...existingAccount.accountData,
          interestRate: parseFloat(usedPayload.interestRate),
          minimumBalance: parseFloat(usedPayload.minimumBalance),
          initialDeposit: parseFloat(usedPayload.initialDeposit)
        }
      });
      return newMap;
    });

    // Reset form data
    setSavingData({
      interestRate: "",
      minimumBalance: "",
      initialDeposit: ""
    });
  };


  /**
   * Handle account update - fetch existing data and show modal
   */
  const handleUpdateAccount = async (userId) => {
    try {
      setCurrentUserId(userId);
      setCurrentUserAccountStatus('EXISTS');

      // Get account data from our cached map first
      const accountInfo = userAccountsMap.get(userId);

      if (accountInfo?.accountData) {
        // Use cached data
        setSavingData({
          interestRate: accountInfo.accountData.interestRate?.toString() || "",
          minimumBalance: accountInfo.accountData.minimumBalance?.toString() || "",
          initialDeposit: accountInfo.accountData.initialDeposit?.toString() || ""
        });
        setIsModalOpen(true);
      }
      else {
        // Fallback to API call if no cached data
        const getApiUrl = `http://localhost:8080/api/saving/get-by-userId/${userId}`;

        console.log('Fetching account data for user:', userId);
        console.log('GET API URL:', getApiUrl);

        const response = await fetch(getApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch saving account data: ${errorText}`);
        }

        const accountData = await response.json();
        console.log('Fetched account data:', accountData);

        setSavingData({
          interestRate: accountData.interestRate?.toString() || "",
          minimumBalance: accountData.minimumBalance?.toString() || "",
          initialDeposit: accountData.initialDeposit?.toString() || ""
        });

        setIsModalOpen(true);
      }

    } catch (error) {
      console.error('Error fetching account data:', error);
      toast.error('Failed to fetch account data: ' + error.message);
    }
  };

  // UPDATED: Handle delete confirmation dialog
  // Replace your existing handleDeleteClick function with this one
  /**
   * Handle delete confirmation dialog - now gets account number from userAccountsMap
   */
  const handleDeleteClick = (userId) => {
    const accountInfo = userAccountsMap.get(userId);

    if (accountInfo?.hasAccount && accountInfo?.accountData?.accountNumber) {
      setUserToDelete(userId); // Keep for UI reference
      setAccountToDelete(accountInfo.accountData.accountNumber); // Store account number for API call
      setIsDeleteConfirmOpen(true);
    } else {
      console.error('Account number not found for user:', userId);
      toast.error('Cannot delete: Account number not found');
    }
  };

  // UPDATED: Handle account deletion using account number
  // Replace your existing handleDeleteAccount function with this one
  /**
   * Handle account deletion using account number instead of user ID
   */
  const handleDeleteAccount = async () => {
    if (!accountToDelete) {
      console.error('No account number available for deletion');
      toast.error('Cannot delete: No account number specified');
      return;
    }

    try {
      // UPDATED API URL: Now uses account number instead of user ID
      const apiUrl = `http://localhost:8080/api/saving/delete-by-accountNumber/${accountToDelete}`;

      console.log('Delete account with account number:', accountToDelete);
      console.log('DELETE API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete saving account: ${errorText}`);
      }

      toast.success('Saving account deleted successfully!');

      // Update the accounts map immediately for instant UI update
      // NOTE: Still using userToDelete (userId) to update the UI state
      setUserAccountsMap(prev => {
        const newMap = new Map(prev);
        newMap.set(userToDelete, {
          hasAccount: false,
          accountData: null
        });
        return newMap;
      });

      // Reset all delete-related state
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      setAccountToDelete(null); // NEW: Reset account number

    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account: ' + error.message);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      setAccountToDelete(null); // NEW: Reset account number on error
    }
  };

  // UPDATED: Delete confirmation modal cleanup
  // Replace the cancel button onClick in your delete confirmation modal with this:
  /**
   * Handle delete modal cancel - now resets both user and account state
   */
  // const handleDeleteCancel = () => {
  //   setIsDeleteConfirmOpen(false);
  //   setUserToDelete(null);
  //   setAccountToDelete(null); // NEW: Reset account number
  // };


  /**
   * Render action buttons based on account status
   */
  const renderActionButtons = (userId) => {
    const accountInfo = userAccountsMap.get(userId);
    const hasAccount = accountInfo?.hasAccount || false;

    return (
      <div className="flex gap-2 justify-center">
        {!hasAccount ? (
          <button
            className="bg-teal-600 text-white px-5 py-1 rounded hover:bg-teal-700 transition-colors text-sm"
            onClick={() => handleAddSaving(userId)}
            disabled={accountsLoading}
          >
            {accountsLoading ? 'Loading...' : 'Create+'}
          </button>
        ) : (
          <>
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
              onClick={() => handleUpdateAccount(userId)}
              title="Update Account"
            >
              <EditNoteIcon fontSize="small" />
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
              onClick={() => handleDeleteClick(userId)}
              title="Delete Account"
            >
              <DeleteOutline fontSize="small" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-300 shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)',
      }}>

      {/* App description section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Saving Account</h1>
       <p className="text-gray-600">
          Create and manage savings accounts for customers 
          {user?.role === 'SUPER_ADMIN' 
            ? ' across all branches.'  // For SUPER_ADMIN, show all branches message
            : (
                <>
                  in branch: <span className="font-semibold text-teal-600">{adminBranch}</span>.
                </>
              )
          }
          Our savings accounts offer competitive interest rates and flexible terms to help customers grow their wealth securely.
        </p>
      </div>

      {/* Debug information - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 border border-gray-200 bg-gray-50 rounded text-sm">
          
          <p className='font-bold'>Branch: <span className='text-teal-600 font-semibold'>
              {user?.role === 'SUPER_ADMIN' ? 'All Branches' : adminBranch}</span>
          </p>
          <p className='font-semibold'>Total Saving-A/C : {Array.from(userAccountsMap.values()).filter(info => info.hasAccount).length}</p>
          <p className='font-semibold'>Total Customers: {filteredUsers.length}</p>
          {/* <p>Accounts loading: {accountsLoading ? 'Yes' : 'No'}</p> */}
        </div>
      )}

      {/* Search section */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">Search by Name</option>
            <option value="mobile">Search by Mobile</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto h-[400px]">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className='bg-gray-100'>
            <tr className="bg-gray-100 sticky top-0">
              <th className="py-3 px-6 border-b text-left">userId</th>
              <th className="py-3 px-6 border-b text-left">Name</th>
              <th className="py-3 px-6 border-b text-left">Mobile</th>
              <th className="py-3 px-6 border-b text-left">Address</th>
              <th className="py-3 px-6 border-b text-left">Email</th>
              <th className="py-3 px-6 border-b text-left">Branch</th>
              <th className="py-3 px-6 border-b text-left">Date</th>
              <th className="py-3 px-4 border-b text-center bg-gray-100"
                style={{ position: 'sticky', right: 0, zIndex: 60 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading || accountsLoading ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center text-red-600">{error}</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">
                  {user?.role === 'SUPER_ADMIN' 
                    ? "No users found"  // For SUPER_ADMIN, simple message
                    : (adminBranch === "NA" 
                        ? "Please select a valid branch" 
                        : "No users found for this branch"
                      )
                  }
                </td>
              </tr>

            ) : (
              filteredUsers.map((user) => {
                const accountInfo = userAccountsMap.get(user.userId);
                const hasAccount = accountInfo?.hasAccount || false;

                return (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.userId}</td>
                    <td className="py-3 px-4 border-b">
                      {user.firstName} {user.middleName && user.middleName !== 'NA' ? user.middleName + ' ' : ''}{user.lastName}
                      {!hasAccount && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                          New
                        </span>
                      )}
                      {hasAccount && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 border-b">{user.mobile}</td>
                    <td className="py-3 px-6 border-b">{user.address}</td>
                    <td className="py-3 px-6 border-b">{user.email}</td>
                    <td className="py-3 px-6 border-b" style={{ position: 'sticky', right: 0 }}>{user.branch}</td>
                    <td className="py-3 px-6 border-b">{user.createdAt}</td>
                    <td className="py-2 px-6 border-b text-center bg-white"
                      style={{ position: 'sticky', right: 0 }}>
                      {renderActionButtons(user.userId)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/updating saving account */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentUserAccountStatus ? 'Update Savings Account' : 'Create Savings Account'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={savingData.interestRate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Minimum Balance (₹)</label>
                <input
                  type="number"
                  name="minimumBalance"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={savingData.minimumBalance}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Initial Deposit (₹)</label>
                <input
                  type="number"
                  name="initialDeposit"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={savingData.initialDeposit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {currentUserAccountStatus ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal for create/update */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Confirm Savings Account {currentUserAccountStatus ? 'Update' : 'Creation'}
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to {currentUserAccountStatus ? 'update' : 'create'} a savings account with the following details?
            </p>
            <div className="mb-4 bg-gray-100 border border-gray-200 p-3 rounded">
              <p className="mb-2"><span className="font-semibold">Interest Rate:</span> {savingData.interestRate}%</p>
              <p className="mb-2"><span className="font-semibold">Minimum Balance:</span> ₹{parseFloat(savingData.minimumBalance || 0).toFixed(2)}</p>
              <p><span className="font-semibold">Initial Deposit:</span> ₹{parseFloat(savingData.initialDeposit || 0).toFixed(2)}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Savings Account</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this savings account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default CreateSaving;