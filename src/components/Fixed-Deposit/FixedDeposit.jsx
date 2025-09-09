import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ojalLogo from '../../assets/ojal-logo.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./FixedDeposit.css";

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

const FixedDeposit = () => {
  const { users, loading: usersLoading, error, refreshUsers } = useUsers();
  const { user } = useAuth();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [isFdFormOpen, setIsFdFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [fdFormData, setFdFormData] = useState({
    principalAmount: "",
    interestRate: "",
    tenureMonths: ""
  });
  const [userFdAccountsMap, setUserFdAccountsMap] = useState(new Map());
  const [fdAccountsLoading, setFdAccountsLoading] = useState(false);
  const [currentFdAccountStatus, setCurrentFdAccountStatus] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const branchName = user?.branchName || "NA";
  const [adminBranch, setAdminBranch] = useState(branchName);

  // Number to words function
  const numberToWords = (num) => {
    if (num === 0) return 'Zero';

    const belowTwenty = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    function helper(n) {
      if (n === 0) return '';
      if (n < 20) return belowTwenty[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
      if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
      if (n < 100000) return helper(Math.floor(n / 1000)) + ' Thousand ' + helper(n % 1000);
      if (n < 10000000) return helper(Math.floor(n / 100000)) + ' Lakh ' + helper(n % 100000);
      return helper(Math.floor(n / 10000000)) + ' Crore ' + helper(n % 10000000);
    }

    return helper(num).trim() + ' Rupees Only';
  };

  // Handle receipt click
  const handleReceiptClick = (account) => {
    setSelectedAccount(account);
    setIsReceiptModalOpen(true);
  };

  // Handle print
  const handlePrint = () => {
    const content = document.getElementById('receipt-content').innerHTML;
    const printWindow = window.open('', '', 'height=600, width=800');
    printWindow.document.write('<html><head><title>FD Receipt</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 5px; text-align: center; } .red-bg { background-color: red; color: white; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Handle download PDF
  const handleDownload = () => {
    const input = document.getElementById('receipt-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`FD_Receipt_${selectedAccount.accountNumber}.pdf`);
    });
  };

  // Fetch FD accounts data
  const fetchFdAccountsData = useCallback(async () => {
    if (!adminBranch || adminBranch === "NA" || !users || users.length === 0) {
      setUserFdAccountsMap(new Map());
      return;
    }

    setFdAccountsLoading(true);
    const accountsMap = new Map();

    try {
      const branchUsers = user?.role === 'SUPER_ADMIN' 
        ? users 
        : users.filter(user => user.branch === adminBranch);

      const accountCheckPromises = branchUsers.map(async (user) => {
        try {
          const response = await fetch(`http://localhost:8080/api/fds/get-all-fds-by-userId/${user.userId}`);
          if (response.ok) {
            const fdAccounts = await response.json();
            accountsMap.set(user.userId, {
              hasFdAccount: fdAccounts.length > 0,
              fdAccounts: fdAccounts.map(account => ({
                accountNumber: account.accountNumber,
                principalAmount: account.principalAmount,
                interestRate: account.interestRate,
                tenureMonths: account.tenureMonths,
                maturityAmount: account.maturityAmount,
                maturityDate: account.maturityDate,
                status: account.status,
                createdAt: account.createdAt
              }))
            });
          } else if (response.status === 404) {
            accountsMap.set(user.userId, { hasFdAccount: false, fdAccounts: [] });
          }
        } catch (err) {
          console.warn(`Error checking FD accounts for user ${user.userId}:`, err);
          accountsMap.set(user.userId, { hasFdAccount: false, fdAccounts: [] });
        }
      });

      await Promise.all(accountCheckPromises);
      setUserFdAccountsMap(accountsMap);
    } catch (err) {
      console.error('Error fetching FD accounts data:', err);
      toast.error('Failed to fetch FD accounts data');
      setUserFdAccountsMap(new Map());
    } finally {
      setFdAccountsLoading(false);
    }
  }, [adminBranch, users, user?.role]);

  useEffect(() => {
    fetchFdAccountsData();
  }, [fetchFdAccountsData]);

  // Filter and sort users
  useEffect(() => {
    if (users && users.length > 0) {
      const branchUsers = user?.role === 'SUPER_ADMIN' 
        ? users 
        : users.filter(user => user.branch === adminBranch);

      const sortedUsers = branchUsers.sort((a, b) => {
        const aAccountInfo = userFdAccountsMap.get(a.userId);
        const bAccountInfo = userFdAccountsMap.get(b.userId);
        const aHasFdAccount = aAccountInfo?.hasFdAccount || false;
        const bHasFdAccount = bAccountInfo?.hasFdAccount || false;

        if (!aHasFdAccount && bHasFdAccount) return -1;
        if (aHasFdAccount && !bHasFdAccount) return 1;

        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });

      setFilteredUsers(sortedUsers);
    }
  }, [users, userFdAccountsMap, adminBranch, user?.role]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term, type) => {
      if (!users || users.length === 0) return;

      let branchUsers = user?.role === 'SUPER_ADMIN' 
        ? users 
        : users.filter(user => user.branch === adminBranch);

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

      const sortedUsers = branchUsers.sort((a, b) => {
        const aAccountInfo = userFdAccountsMap.get(a.userId);
        const bAccountInfo = userFdAccountsMap.get(b.userId);
        const aHasFdAccount = aAccountInfo?.hasFdAccount || false;
        const bHasFdAccount = bAccountInfo?.hasFdAccount || false;

        if (!aHasFdAccount && bHasFdAccount) return -1;
        if (aHasFdAccount && !bHasFdAccount) return 1;

        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });

      setFilteredUsers(sortedUsers);
    }, 500),
    [users, userFdAccountsMap, adminBranch, user?.role]
  );

  useEffect(() => {
    debouncedSearch(searchTerm, searchType);
  }, [searchTerm, searchType, debouncedSearch]);

  // Handle FD form input changes
  const handleFdFormChange = (e) => {
    const { name, value } = e.target;
    setFdFormData({
      ...fdFormData,
      [name]: value
    });
  };

  // Open FD form for creating or updating
  const handleAddFD = (user) => {
    setSelectedUser(user);
    setCurrentFdAccountStatus(null);
    setFdFormData({
      principalAmount: "",
      interestRate: "",
      tenureMonths: ""
    });
    setIsFdFormOpen(true);
    setIsHistoryModalOpen(false);
  };

  // Open FD form for updating specific account
  const handleUpdateFD = (user, account) => {
    setSelectedUser(user);
    setCurrentFdAccountStatus(account.accountNumber);
    setFdFormData({
      principalAmount: account.principalAmount.toString(),
      interestRate: account.interestRate.toString(),
      tenureMonths: account.tenureMonths.toString()
    });
    setIsFdFormOpen(true);
    setIsHistoryModalOpen(false);
  };

  // Form validation and submission
  const handleFdFormSubmit = (e) => {
    e.preventDefault();

    const principalAmountStr = fdFormData.principalAmount?.toString().trim();
    const interestRateStr = fdFormData.interestRate?.toString().trim();
    const tenureMonthsStr = fdFormData.tenureMonths?.toString().trim();

    if (!principalAmountStr || !interestRateStr || !tenureMonthsStr) {
      toast.error('Please fill in all required fields');
      return;
    }

    const principalAmount = parseFloat(principalAmountStr);
    const interestRate = parseFloat(interestRateStr);
    const tenureMonths = parseInt(tenureMonthsStr);

    if (isNaN(principalAmount) || isNaN(interestRate) || isNaN(tenureMonths)) {
      toast.error('Please enter valid numeric values');
      return;
    }

    if (principalAmount < 1000) {
      toast.error('Principal amount must be at least ₹1000');
      return;
    }

    if (interestRate < 1 || interestRate > 15) {
      toast.error('Interest rate must be between 1% and 15%');
      return;
    }

    if (tenureMonths < 1 || tenureMonths > 120) {
      toast.error('Tenure must be between 1 and 120 months');
      return;
    }

    setIsFdFormOpen(false);
    setIsConfirmModalOpen(true);
  };

  // Handle confirmation for create or update
  const handleConfirmAction = async () => {
    if (currentFdAccountStatus) {
      await handleUpdateConfirm();
    } else {
      await handleConfirm();
    }
  };

  // Create FD account
  const handleConfirm = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/accounts/${selectedUser.userId}/fd`;
      const payload = {
        principalAmount: parseFloat(fdFormData.principalAmount),
        interestRate: parseFloat(fdFormData.interestRate),
        tenureMonths: parseInt(fdFormData.tenureMonths)
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create FD account: ${errorText}`);
      }

      const data = await response.json();
      setIsConfirmModalOpen(false);
      toast.success('Fixed Deposit created successfully!');

      // Update accounts map locally
      setUserFdAccountsMap(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(selectedUser.userId) || { hasFdAccount: false, fdAccounts: [] };
        newMap.set(selectedUser.userId, {
          hasFdAccount: true,
          fdAccounts: [
            ...existing.fdAccounts,
            {
              accountNumber: data.accountNumber,
              principalAmount: parseFloat(payload.principalAmount),
              interestRate: parseFloat(payload.interestRate),
              tenureMonths: parseInt(payload.tenureMonths),
              maturityAmount: data.maturityAmount,
              maturityDate: data.maturityDate,
              status: data.status,
              createdAt: data.createdAt
            }
          ]
        });
        return newMap;
      });

      setFdFormData({
        principalAmount: "",
        interestRate: "",
        tenureMonths: ""
      });

      await fetchFdAccountsData();
    } catch (error) {
      console.error('Error creating FD account:', error);
      setIsConfirmModalOpen(false);
      toast.error('Failed to create FD account: ' + error.message);
    }
  };

  // Update FD account
  const handleUpdateConfirm = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/fds/patch-fd-by-accNum/${currentFdAccountStatus}`;
      const payload = {
        principalAmount: parseFloat(fdFormData.principalAmount),
        interestRate: parseFloat(fdFormData.interestRate),
        tenureMonths: parseInt(fdFormData.tenureMonths)
      };

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update FD account: ${errorText}`);
      }

      const data = await response.json();
      setIsConfirmModalOpen(false);
      toast.success('Fixed Deposit updated successfully!');

      // Update accounts map locally
      setUserFdAccountsMap(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(selectedUser.userId);
        const updatedAccounts = existing.fdAccounts.map(account =>
          account.accountNumber === currentFdAccountStatus
            ? {
                ...account,
                principalAmount: parseFloat(payload.principalAmount),
                interestRate: parseFloat(payload.interestRate),
                tenureMonths: parseInt(payload.tenureMonths),
                maturityAmount: data.maturityAmount,
                maturityDate: data.maturityDate,
                status: data.status
              }
            : account
        );
        newMap.set(selectedUser.userId, { ...existing, fdAccounts: updatedAccounts });
        return newMap;
      });

      setFdFormData({
        principalAmount: "",
        interestRate: "",
        tenureMonths: ""
      });

      await fetchFdAccountsData();
    } catch (error) {
      console.error('Error updating FD account:', error);
      setIsConfirmModalOpen(false);
      toast.error('Failed to update FD account: ' + error.message);
    }
  };

  // Delete single FD account
  const handleDeleteClick = (user, accountNumber) => {
    setAccountToDelete(accountNumber);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/fds/delete-fd-by-accNum/${accountToDelete}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete FD account: ${errorText}`);
      }

      toast.success('Fixed Deposit deleted successfully!');
      setIsDeleteConfirmOpen(false);

      // Update accounts map locally
      setUserFdAccountsMap(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(selectedUser.userId);
        const updatedAccounts = existing.fdAccounts.filter(
          account => account.accountNumber !== accountToDelete
        );
        newMap.set(selectedUser.userId, {
          hasFdAccount: updatedAccounts.length > 0,
          fdAccounts: updatedAccounts
        });
        return newMap;
      });

      const updatedAccountsLength = userFdAccountsMap.get(selectedUser.userId)?.fdAccounts.filter(
        account => account.accountNumber !== accountToDelete
      ).length || 0;
      if (updatedAccountsLength === 0) {
        setIsHistoryModalOpen(false);
      }

      setAccountToDelete(null);
      await fetchFdAccountsData();
    } catch (error) {
      console.error('Error deleting FD account:', error);
      toast.error('Failed to delete FD account: ' + error.message);
      setIsDeleteConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

  // Delete all FD accounts
  const handleDeleteAllFDsClick = () => {
    setIsDeleteAllConfirmOpen(true);
  };

  const handleDeleteAllFDs = async () => {
    try {
      const apiUrl = `http://localhost:8080/api/fds/delete-all-fds-by-userId/${selectedUser.userId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete all FD accounts');
      }

      toast.success('All Fixed Deposits deleted successfully!');
      setIsDeleteAllConfirmOpen(false);
      setIsHistoryModalOpen(false);

      setUserFdAccountsMap(prev => {
        const newMap = new Map(prev);
        newMap.set(selectedUser.userId, {
          hasFdAccount: false,
          fdAccounts: []
        });
        return newMap;
      });

      setSelectedUser(null);
      await fetchFdAccountsData();
    } catch (error) {
      console.error('Error deleting all FD accounts:', error);
      let errorMessage = 'Failed to delete all FD accounts: ' + error.message;
      if (error.message.includes('foreign key constraint')) {
        errorMessage = 'Cannot delete FD accounts because they have associated transactions. Please contact the backend team to resolve this issue.';
      }
      toast.error(errorMessage);
      setIsDeleteAllConfirmOpen(false);
    }
  };

  // Open history modal
  const handleHistoryClick = (user) => {
    setSelectedUser(user);
    setIsHistoryModalOpen(true);
  };

  // Calculate maturity amount
  const calculateMaturityAmount = () => {
    const P = parseFloat(fdFormData.principalAmount) || 0;
    const r = parseFloat(fdFormData.interestRate) || 0;
    const t = parseInt(fdFormData.tenureMonths) || 0;
    const interest = (P * r * t) / 1200;
    const maturityAmount = P + interest;
    return maturityAmount.toFixed(2);
  };

  // Render action buttons
  const renderActionButtons = (user) => {
    const accountInfo = userFdAccountsMap.get(user.userId);
    const hasFdAccount = accountInfo?.hasFdAccount || false;

    return (
      <div className="flex gap-2 justify-center">
        {!hasFdAccount ? (
          <button
            className="bg-teal-600 text-white p-2 w-[100px] rounded hover:bg-teal-700 transition-colors"
            onClick={() => handleAddFD(user)}
            disabled={fdAccountsLoading}
          >
            {fdAccountsLoading ? 'Loading...' : 'Create FD'}
          </button>
        ) : (
          <button
            className="bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors"
            onClick={() => handleHistoryClick(user)}
            title="View FD History"
          >
            View FDs
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-300 shadow-sm"
         style={{
           background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)',
         }}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Fixed Deposit</h1>
        <p className="text-gray-600">
          Create and manage fixed deposit accounts for customers 
          {user?.role === 'SUPER_ADMIN' 
            ? ' across all branches.' 
            : (
                <>
                  in branch: <span className="font-semibold text-teal-600">{adminBranch}</span>.
                </>
              )
          }
          Fixed deposits offer guaranteed returns on one-time investments over a fixed period, 
          providing financial security and steady growth.
        </p>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 border border-gray-200 bg-gray-50 rounded text-sm">
          <p className='font-bold'>Branch: <span className='text-teal-600 font-semibold'>
              {user?.role === 'SUPER_ADMIN' ? 'All Branches' : adminBranch}</span>
          </p>
          <p className='font-semibold'>Total FD Accounts: {Array.from(userFdAccountsMap.values()).reduce((sum, info) => sum + (info.fdAccounts?.length || 0), 0)}</p>
          <p className='font-semibold'>Total Customers: {filteredUsers.length}</p>
        </div>
      )}

      {/* Search Section */}
      <div className="mb-6 flex flex-wrap items-center gap-3 fd-search-container">
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

      {/* Table Section */}
      <div className="fd-table-container overflow-x-auto h-[500px]">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="sticky top-0 z-50">
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">User ID</th>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Mobile</th>
              <th className="py-3 px-4 border-b text-left">Email</th>
              <th className="py-3 px-4 border-b text-left">Address</th>
              <th className="py-3 px-4 border-b text-left">Branch</th>
              <th className="py-3 px-4 border-b text-left">Date</th>
              <th className="py-3 px-4 border-b text-center bg-slate-100"
                  style={{ position: 'sticky', right: 0, zIndex: 60 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {usersLoading || fdAccountsLoading ? (
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
                    ? "No users found" 
                    : (adminBranch === "NA" 
                        ? "Please select a valid branch" 
                        : "No users found for this branch")
                  }
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const accountInfo = userFdAccountsMap.get(user.userId);
                const hasFdAccount = accountInfo?.hasFdAccount || false;

                return (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{user.userId}</td>
                    <td className="py-3 px-4 border-b">
                      {user.firstName} {user.middleName && user.middleName !== 'NA' ? user.middleName + ' ' : ''}{user.lastName}
                      {!hasFdAccount && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                          New
                        </span>
                      )}
                      {hasFdAccount && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b">{user.mobile}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">{user.address}</td>
                    <td className="py-3 px-4 border-b">{user.branch}</td>
                    <td className="py-3 px-4 border-b">{user.createdAt}</td>
                    <td className="py-2 px-4 border-b text-center bg-gray-50"
                        style={{ position: 'sticky', right: 0 }}>
                      {renderActionButtons(user)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FD Form Modal */}
      {isFdFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg  shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentFdAccountStatus ? 'Update Fixed Deposit' : 'Create Fixed Deposit'} for {selectedUser?.firstName} {selectedUser?.lastName}
            </h2>
            <form onSubmit={handleFdFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="principalAmount">Principal Amount (₹)</label>
                <input
                  type="number"
                  id="principalAmount"
                  name="principalAmount"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={fdFormData.principalAmount}
                  onChange={handleFdFormChange}
                  required
                  min="1000"
                  step="100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="interestRate">Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={fdFormData.interestRate}
                  onChange={handleFdFormChange}
                  required
                  min="1"
                  max="15"
                  step="0.1"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="tenureMonths">Tenure (Months)</label>
                <input
                  type="number"
                  id="tenureMonths"
                  name="tenureMonths"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={fdFormData.tenureMonths}
                  onChange={handleFdFormChange}
                  required
                  min="1"
                  max="120"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setIsFdFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  {currentFdAccountStatus ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg h-[550px] overflow-auto shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Confirm Fixed Deposit {currentFdAccountStatus ? 'Update' : 'Creation'}
            </h2>
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-bold text-teal-700">User Information :-</h3>
              <div className="fd-detail-item">
                <span className="font-semibold">Name:</span>
                <span>{selectedUser?.firstName} {selectedUser?.middleName && selectedUser?.middleName !== 'NA' ? selectedUser?.middleName + ' ' : ''}{selectedUser?.lastName}</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Mobile:</span>
                <span>{selectedUser?.mobile}</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Email:</span>
                <span>{selectedUser?.email}</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Branch:</span>
                <span className="bg-purple-800 rounded-lg px-2 text-white border-2 border-purple-300">{selectedUser?.branch}</span>
              </div>
              <h3 className="mb-3 mt-4 text-lg font-bold text-teal-700">FD Details :-</h3>
              <div className="fd-detail-item">
                <span className="font-semibold">Principal Amount:</span>
                <span>₹{parseFloat(fdFormData.principalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Interest Rate:</span>
                <span>{parseFloat(fdFormData.interestRate || 0).toFixed(2)}%</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Tenure:</span>
                <span>{fdFormData.tenureMonths} months</span>
              </div>
              <div className="fd-detail-item">
                <span className="font-semibold">Maturity Amount (Approx):</span>
                <span className="bg-purple-800 border-2 border-purple-300  p-1 text-white rounded-xl">₹{calculateMaturityAmount()}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 sticky bg-slate-50 bottom-0 border-t border-gray-200">
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

      {/* Delete Single FD Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Fixed Deposit</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this fixed deposit account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setAccountToDelete(null);
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

      {/* Delete All FDs Confirmation Modal */}
      {isDeleteAllConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete All Fixed Deposits</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete all fixed deposit accounts for {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteAllConfirmOpen(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteAllFDs}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-700">FD Account History for ({selectedUser?.firstName} {selectedUser?.lastName})</h2>
              <button 
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setIsHistoryModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="mb-4 border-b border-gray-200 pb-2">
              <p className="mb-2"><span className="font-semibold">User ID:</span> {selectedUser?.userId}</p>
              <p className="mb-2"><span className="font-semibold">Mobile:</span> {selectedUser?.mobile}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {selectedUser?.email}</p>
              <p className="mb-2"><span className="font-semibold ">Branch:</span> <span className="bg-purple-800 rounded-lg px-2 text-white border-2 border-purple-300">{selectedUser?.branch}</span></p>
              <p className="mb-2"><span className="font-semibold">Total FDs :</span> {userFdAccountsMap.get(selectedUser?.userId)?.fdAccounts?.length}</p>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                  onClick={() => handleAddFD(selectedUser)}
                >
                  Create FD
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  onClick={handleDeleteAllFDsClick}
                >
                  Delete All FDs
                </button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {userFdAccountsMap.get(selectedUser?.userId)?.fdAccounts?.map(account => (
                <div key={account.accountNumber} className="mb-3 p-3 border border-teal-600 rounded-md bg-gray-50">
                  <p className="mb-2"><span className="font-semibold">Account Number:</span> {account.accountNumber}</p>
                  <p className="mb-2"><span className="font-semibold">Principal Amount:</span> ₹{account.principalAmount.toFixed(2)}</p>
                  <p className="mb-2"><span className="font-semibold">Interest Rate:</span> {account.interestRate.toFixed(2)}%</p>
                  <p className="mb-2"><span className="font-semibold">Tenure:</span> {account.tenureMonths} months</p>
                  <p className="mb-2"><span className="font-semibold">Maturity Amount:</span> <span className="bg-purple-800 rounded-lg px-2 text-white border-2 border-purple-300"> ₹{account.maturityAmount.toFixed(2)}</span></p>
                  <p className="mb-2"><span className="font-semibold">Maturity Date: </span>{account.maturityDate}</p>
                  <p className="mb-2"><span className="font-semibold">Status:</span> <span className="bg-green-700 rounded-lg px-2 text-white border-2 border-green-300">{account.status}</span></p>
                  <p className="mb-2"><span className="font-semibold">A/C Open Date:</span> {account.createdAt}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                      onClick={() => handleUpdateFD(selectedUser, account)}
                      title="Update FD"
                    >
                      <EditNoteIcon fontSize="small" />
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                      onClick={() => handleDeleteClick(selectedUser, account.accountNumber)}
                      title="Delete FD"
                    >
                      <DeleteOutline fontSize="small" />
                    </button>
                    <button
                      className="bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors"
                      onClick={() => handleReceiptClick(account)}
                      title="Receipt"
                    >
                      <ReceiptLongIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-auto h-[550px] relative">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">FD Receipt</h2>
              <button 
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setIsReceiptModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div id="receipt-content" style={{ border: '2px solid orange', backgroundColor: 'white', padding: '10px', fontFamily: 'Arial, sans-serif', fontSize: '12px', position: 'relative' }}>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <img src={ojalLogo} alt="OJAL Logo" style={{ width: '100px', marginRight:"40px", display: 'inline-block', verticalAlign: 'middle' }} />
                <h1 style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '80px', marginBottom:"45px", fontSize: '24px' }}>OJAL MICRO SERVICE FOUNDATION</h1>
              </div>
              <p className="font-semibold" style={{ textAlign: 'center' }}>CIN No.: U88900PN2023NPL219300</p>
              <p style={{ textAlign: 'center' }}>ADDRESS: REGULATED AND CONTROLLED BY MINISTRY OF CORPORATE AFFAIRS, GOVT. OF INDIA. : S/N 73 शिवनगरी, हिंदू कॉलनी, दिघी, पुणे - 411015</p>
              <p style={{ textAlign: 'center' }}>CONTACT NO. : <span className="font-bold">7499552539, 8830126738</span>    • EMAIL ID: <span className="font-bold">ojalmicroservicefoundation.obs@gmail.com</span></p>
              <div className="text-center" style={{ backgroundColor: 'orange', color: 'white', padding: '5px', fontSize: '18px', marginTop: '12px', position: 'relative' }}><h2 className="mb-3 font-bold">मुदत ठेव / FIXED DEPOSIT</h2></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div className="font-semibold" style={{ width: '48%' }}>
                  <p>जारी करणारी शाखा / Issuing Branch: {selectedUser.branch}</p>
                  <p>Received with thanks from:</p>
                  <p>श्री / श्रीमती / Shri / Smt. {selectedUser.firstName} {selectedUser.middleName && selectedUser.middleName !== 'NA' ? selectedUser.middleName + ' ' : ''}{selectedUser.lastName}</p>
                  <p>संयुक्त अर्जदाराचे नाव / Joint Applicant Name: </p>
                  <p>नामनिर्देशित व्यक्ती / Nominee: </p>
                </div>
                <div className="font-semibold" style={{ width: '48%' }}>
                  <p>प्रमाणपत्र क्रमांक / Certificate No.: ................</p>
                  <p>सदस्य आयडी / Member ID: {selectedUser.userId}</p>
                  <p>खाते क्रमांक / Account No.: {selectedAccount.accountNumber}</p>
                  <p>योजना / Scheme: </p>
                  <p>पूर्ण पी ए आउट / M. Pay Out: </p>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', tableLayout: 'fixed', border: '1px solid black' }}>
                <thead>
                  <tr className="red-bg">
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>ठेव करण्याची तारीख / Deposit Date</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>ठेव रक्कम (रुपये) / Principal Amount(Rs.)</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>कालावधी (महिने) / Period (Months)</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>व्याज दर / Rate of Interest</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>परिपक्वता तारीख / Maturity Date</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '16.67%', border: '1px solid black' }}>परिपक्वता रक्कम / Maturity Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{new Date(selectedAccount.createdAt).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{selectedAccount.principalAmount.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{selectedAccount.tenureMonths}</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{selectedAccount.interestRate.toFixed(2)}</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{new Date(selectedAccount.maturityDate).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid black' }}>{selectedAccount.maturityAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: '20px', textAlign: 'center' }}>रक्कम शब्दांत / Amount in Words: {numberToWords(Math.floor(selectedAccount.maturityAmount))}</p>
              <p style={{ textAlign: 'center' }}>जारी करण्याची तारीख / Date of Issue: {new Date().toLocaleDateString('en-GB')}</p>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <p>OJAL MICRO SERVICE FOUNDATION</p>
                <p>अधिकृत स्वाक्षरी / Authorised Signatory</p>
              </div>
              <img src={ojalLogo} alt="Watermark Logo" style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', opacity: '0.2', width: '150px', zIndex: '1', pointerEvents: 'none' }} />
            </div>
            <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-white z-10 py-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleDownload}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
};

export default FixedDeposit;