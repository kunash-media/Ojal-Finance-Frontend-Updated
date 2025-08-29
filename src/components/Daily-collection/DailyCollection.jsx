import "./DailyCollection.css";
import { useState, useEffect, useCallback } from "react";
import { Calendar, X, CreditCard, History, Filter } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dummy data for demonstration
const DUMMY_DATA = [
  {
    userId: "USR001",
    name:"Sunder Pichai",
    accountNumber: "SA21391062",
    createdAt: "2025-01-15T10:30:00",
    accountStatus: "Active",
    balance: 15000.00,
    interestRate: 4.5,
    transactions: [
      {
        id: 1,
        amount: 5000.00,
        payMode: "IMPS",
        utrNo: "IMPS987654321012",
        cash: null,
        chequeNumber: null,
        note: "Salary credit Salary credit Salary credit Salary credit",
        timestamp: "2025-05-15T14:30:00"
      },
      {
        id: 2,
        amount: 2000.00,
        payMode: "Cash",
        utrNo: null,
        cash: true,
        chequeNumber: null,
        note: "Regular deposit",
        timestamp: "2025-05-12T11:45:00"
      },
      {
        id: 3,
        amount: 3500.00,
        payMode: "Cheque",
        utrNo: null,
        cash: null,
        chequeNumber: "CHQ123456",
        note: "Monthly deposit",
        timestamp: "2025-05-05T09:15:00"
      }
    ]
  },
  {
    userId: "USR002",
    name:"Sam Altman",
    accountNumber: "SA61391062",
    createdAt: "2025-02-20T09:15:00",
    accountStatus: "Inactive",
    balance: 7500.00,
    interestRate: 3.5,
    transactions: [
      {
        id: 1,
        amount: 1000.00,
        payMode: "Cash",
        utrNo: null,
        cash: true,
        chequeNumber: null,
        note: "Initial deposit",
        timestamp: "2025-05-10T10:00:00"
      }
    ]
  },
  {
    userId: "USR003",
    name:"Ajay Devgan",
    accountNumber: "SA71391062",
    createdAt: "2025-03-05T14:45:00",
    accountStatus: "Active",
    balance: 25000.00,
    interestRate: 5.0,
    transactions: [
      {
        id: 1,
        amount: 10000.00,
        payMode: "IMPS",
        utrNo: "IMPS123456789012",
        cash: null,
        chequeNumber: null,
        note: "Investment deposit",
        timestamp: "2025-05-18T08:30:00"
      },
      {
        id: 2,
        amount: 15000.00,
        payMode: "Cheque",
        utrNo: null,
        cash: null,
        chequeNumber: "CHQ789012",
        note: "Property rent",
        timestamp: "2025-05-01T16:20:00"
      }
    ]
  },
  {
    userId: "USR004",
    name:"Sharukh Khan",
    accountNumber: "SA41391062",
    createdAt: "2025-03-05T14:45:00",
    accountStatus: "Active",
    balance: 25000.00,
    interestRate: 5.0,
    transactions: [
      {
        id: 1,
        amount: 10000.00,
        payMode: "IMPS",
        utrNo: "IMPS123456789012",
        cash: null,
        chequeNumber: null,
        note: "Investment deposit",
        timestamp: "2025-05-18T08:30:00"
      },
      {
        id: 2,
        amount: 15000.00,
        payMode: "Cheque",
        utrNo: null,
        cash: null,
        chequeNumber: "CHQ789012",
        note: "Property rent",
        timestamp: "2025-05-01T16:20:00"
      }
    ]
  }
];

// 2. ADD THIS DEBOUNCE UTILITY FUNCTION (add at the top of your component, before the DailyCollection function)
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

const DailyCollection = () => {
  // State management for all components
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openPayForm, setOpenPayForm] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // const [historyFilterDate, setHistoryFilterDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // State for search functionality
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  // Form data state
  const [paymentData, setPaymentData] = useState({
    amount: "",
    payMode: "Cash",
    utrNo: "",
    chequeNumber: "",
    note: ""
  });

  // Fetch data on component mount
  useEffect(() => {
    // This would be replaced with actual API call
    fetchAccounts();
  }, []);


  // 1. ADD THESE STATE VARIABLES (add near your existing useState declarations)
  const [historyFilterFromDate, setHistoryFilterFromDate] = useState(null);
  const [historyFilterToDate, setHistoryFilterToDate] = useState(null);
  const [historyFilterPayMode, setHistoryFilterPayMode] = useState('');

  // 2. REPLACE YOUR OLD useEffect WITH THIS ONE
  useEffect(() => {
    if (selectedAccount && selectedAccount.transactions) {
      let filtered = [...selectedAccount.transactions];

      // Filter by date range
      if (historyFilterFromDate || historyFilterToDate) {
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.timestamp);
          const fromDate = historyFilterFromDate ? new Date(historyFilterFromDate) : null;
          const toDate = historyFilterToDate ? new Date(historyFilterToDate) : null;

          if (fromDate) fromDate.setHours(0, 0, 0, 0);
          if (toDate) toDate.setHours(23, 59, 59, 999);

          const afterFromDate = !fromDate || transactionDate >= fromDate;
          const beforeToDate = !toDate || transactionDate <= toDate;

          return afterFromDate && beforeToDate;
        });
      }

      // Filter by payment mode
      if (historyFilterPayMode) {
        filtered = filtered.filter(transaction =>
          transaction.payMode.toLowerCase() === historyFilterPayMode.toLowerCase()
        );
      }

      // Sort by most recent first
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setFilteredTransactions(filtered);
    }
  }, [historyFilterFromDate, historyFilterToDate, historyFilterPayMode, selectedAccount]);



  // 3. REPLACE YOUR EXISTING debouncedSearch FUNCTION WITH THIS:
  const debouncedSearch = useCallback(
    debounce((term, type) => {
      if (!term.trim()) {
        setFilteredAccounts(accounts);
        return;
      }

      const filtered = accounts.filter(account => {
        const value = account[type].toLowerCase();
        return value.includes(term.toLowerCase());
      });
      
      setFilteredAccounts(filtered);
    }, 500),
    [accounts]
  );

  // 4. ADD THIS useEffect (this handles initial load and search functionality)
  useEffect(() => {
    if (accounts.length > 0) {
      setFilteredAccounts(accounts);
    }
  }, [accounts]);

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchTerm, searchType);
  }, [searchTerm, searchType, debouncedSearch]);


  // Reset filters when modal is closed
  useEffect(() => {
    if (!openHistoryModal) {
      setHistoryFilterFromDate(null);
      setHistoryFilterToDate(null);
      setHistoryFilterPayMode('');
    }
  }, [openHistoryModal]);




  // Filter transactions when date filter changes
  // useEffect(() => {
  //   if (selectedAccount && selectedAccount.transactions) {
  //     if (historyFilterDate) {
  //       const filterDate = new Date(historyFilterDate);
  //       const filtered = selectedAccount.transactions.filter(transaction => {
  //         const transactionDate = new Date(transaction.timestamp);
  //         return (
  //           transactionDate.getDate() === filterDate.getDate() &&
  //           transactionDate.getMonth() === filterDate.getMonth() &&
  //           transactionDate.getFullYear() === filterDate.getFullYear()
  //         );
  //       });
  //       setFilteredTransactions(filtered);
  //     } else {
  //       // When no filter is applied, show all transactions sorted by most recent
  //       setFilteredTransactions([...selectedAccount.transactions].sort((a, b) => 
  //         new Date(b.timestamp) - new Date(a.timestamp)
  //       ));
  //     }
  //   }
  // }, [historyFilterDate, selectedAccount]);

  // Mock API call function (to be replaced with actual API)
  const fetchAccounts = () => {
    // Simulate API delay
    setTimeout(() => {
      setAccounts(DUMMY_DATA);
    }, 500);
  };

  // Handle pay button click
  const handlePayClick = (account) => {
    setSelectedAccount(account);
    setPaymentData({
      amount: "",
      payMode: "Cash",
      utrNo: "",
      chequeNumber: "",
      note: ""
    });
    setOpenPayForm(true);
  };

  // Updated Handle history button click function
  const handleHistoryClick = (account) => {
    setSelectedAccount(account);

    // Reset all filter states to null/empty
    setHistoryFilterFromDate(null);
    setHistoryFilterToDate(null);
    setHistoryFilterPayMode('');

    // Initial load of all transactions sorted by most recent
    setFilteredTransactions([...account.transactions].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    ));

    setOpenHistoryModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Validate form data before proceeding
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Open confirmation modal with the payment details
    setOpenConfirmModal(true);
  };

  // Handle final payment submission after confirmation
  const handleFinalSubmit = () => {
    // Here would be the actual API call to submit the payment
    console.log("Submitting payment:", {
      accountId: selectedAccount.accountNumber,
      ...paymentData
    });

    // Prepare payload based on selected payment mode
    const payload = {
      amount: parseFloat(paymentData.amount),
      payMode: paymentData.payMode,
      utrNo: paymentData.payMode === "IMPS" ? paymentData.utrNo : null,
      cash: paymentData.payMode === "Cash" ? true : null,
      chequeNumber: paymentData.payMode === "Cheque" ? paymentData.chequeNumber : null,
      note: paymentData.note
    };

    console.log("Backend payload:", payload);

    // For demo, update the local state with the new transaction
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(paymentData.amount),
      payMode: paymentData.payMode,
      utrNo: paymentData.payMode === "IMPS" ? paymentData.utrNo : null,
      cash: paymentData.payMode === "Cash" ? true : null,
      chequeNumber: paymentData.payMode === "Cheque" ? paymentData.chequeNumber : null,
      note: paymentData.note,
      timestamp: new Date().toISOString()
    };

    // Update the accounts state with the new transaction
    const updatedAccounts = accounts.map(account => {
      if (account.userId === selectedAccount.userId) {
        return {
          ...account,
          transactions: [newTransaction, ...account.transactions],
          balance: account.balance + parseFloat(paymentData.amount)
        };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setOpenConfirmModal(false);
    setOpenPayForm(false);
    toast.success('Payment Added successfully!');

  };

  // Helper function to format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Helper function to format just date for filters
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 ">
      {/* Info section at the top */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-lg shadow-lg mb-6 p-4 text-white">
        <h2 className="text-xl font-bold mb-2">
          Daily Collection Dashboard
        </h2>
        <p className="text-sm">
          Manage customer accounts, process payments, and view transaction history.
          Use the payment button to record new deposits and the history button to view past transactions.
        </p>
      </div>

      {/* Search section */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
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
          <option value="accountNumber">Search by Account Number</option>
          {/* <option value="userId">Search by User ID</option> */}
        </select>
        </div>
      </div>

      {/* Main table with account information */}
      <div className="overflow-x-auto h-[320px] shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-teal-600 text-white sticky top-0 z-20">
            <tr className="bg-teal-600">
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Account Number</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Account Status</th>
              <th className="py-3 px-4 text-left">Balance</th>
              <th className="py-3 px-4 text-left">Interest Rate</th>
              <th className="py-3 px-4 text-left bg-teal-600"
                style={{ position: 'sticky', right: 0, zIndex: 60 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr
                key={account.userId}
                className={`border-b ${account.accountStatus === 'Active' ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-5">{account.userId}</td>
                <td className="py-3 px-5">{account.name}</td>
                <td className="py-3 px-5">{account.accountNumber}</td>
                <td className="py-3 px-5">{formatDateTime(account.createdAt)}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded-full text-xs ${account.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {account.accountStatus}
                  </span>
                </td>
                <td className="py-3 px-5">₹{account.balance.toFixed(2)}</td>
                <td className="py-3 px-4">{account.interestRate}%</td>
                <td className="py-3 px-4 space-x-2 bg-white"
                  style={{ position: 'sticky', right: 0 }}>
                  <button
                    className="bg-teal-600 m-2 hover:bg-teal-700 text-white px-5 py-1 rounded text-sm flex items-center"
                    onClick={() => handlePayClick(account)}
                    disabled={account.accountStatus !== 'Active'}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Pay
                  </button>
                  <button
                    className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-2 py-1 rounded text-sm flex items-center"
                    onClick={() => handleHistoryClick(account)}
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Form Modal */}
      {openPayForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-teal-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
              <h3 className="text-lg font-medium">Record Payment</h3>
              <button onClick={() => setOpenPayForm(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-4">
              {selectedAccount && (
                <div className="mb-4">
                  <p className="font-bold">
                    Account: {selectedAccount.accountNumber} ({selectedAccount.name})
                  </p>
                  <p className="text-gray-600 text-sm">
                    Current Balance: ₹{selectedAccount.balance.toFixed(2)}
                  </p>
                  <hr className="my-2" />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₹</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payMode">
                  Payment Mode
                </label>
                <select
                  id="payMode"
                  name="payMode"
                  value={paymentData.payMode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="IMPS">IMPS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {paymentData.payMode === "IMPS" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="utrNo">
                    UTR Number
                  </label>
                  <input
                    id="utrNo"
                    name="utrNo"
                    value={paymentData.utrNo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              {paymentData.payMode === "Cheque" && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chequeNumber">
                    Cheque Number
                  </label>
                  <input
                    id="chequeNumber"
                    name="chequeNumber"
                    value={paymentData.chequeNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                  Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={paymentData.note}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenPayForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {openConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-teal-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
              <h3 className="text-lg font-medium">Confirm Payment</h3>
              <button onClick={() => setOpenConfirmModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {selectedAccount && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold mb-2">Payment Details</h4>
                  <p className="text-sm">
                    <span className="font-semibold">Account:</span> {selectedAccount.accountNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Account Holder:</span> {selectedAccount.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> ₹{parseFloat(paymentData.amount).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Payment Mode:</span> {paymentData.payMode}
                  </p>

                  {paymentData.payMode === "IMPS" && (
                    <p className="text-sm">
                      <span className="font-semibold">UTR Number:</span> {paymentData.utrNo}
                    </p>
                  )}

                  {paymentData.payMode === "Cheque" && (
                    <p className="text-sm">
                      <span className="font-semibold">Cheque Number:</span> {paymentData.chequeNumber}
                    </p>
                  )}

                  {paymentData.note && (
                    <p className="text-sm">
                      <span className="font-semibold">Note:</span> {paymentData.note}
                    </p>
                  )}
                </div>
              )}

              <p className="mb-4 text-gray-700 text-sm">
                Please review the payment details above before confirming. This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpenConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {openHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="bg-teal-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg sticky top-0">
              <div>
                <h3 className="text-lg font-medium">
                  Transaction History
                  {selectedAccount && ` - ${selectedAccount.name}`}
                </h3>
                <h4 className="text-xs font-medium">
                  Account No:
                  {selectedAccount && ` - ${selectedAccount.accountNumber}`}
                </h4>
                <p className="text-xs font-semibold">
                  {selectedAccount && `Total transactions: ${selectedAccount.transactions.length}`}
                </p>
              </div>
              <button onClick={() => setOpenHistoryModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enhanced Filter Section */}
            <div className="sticky top-14 z-10 bg-white border-b px-4 py-3">
              {/* Date Range Filters */}
              <div className="flex flex-wrap items-end gap-3 mb-3">
                <div className="flex-grow min-w-36">
                  <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="filterFromDate">
                    From Date
                  </label>
                  <input
                    id="filterFromDate"
                    type="date"
                    value={historyFilterFromDate || ''}
                    onChange={(e) => setHistoryFilterFromDate(e.target.value || null)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex-grow min-w-36">
                  <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="filterToDate">
                    To Date
                  </label>
                  <input
                    id="filterToDate"
                    type="date"
                    value={historyFilterToDate || ''}
                    onChange={(e) => setHistoryFilterToDate(e.target.value || null)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex-grow min-w-32">
                  <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="filterPayMode">
                    Payment Mode
                  </label>
                  <select
                    id="filterPayMode"
                    value={historyFilterPayMode}
                    onChange={(e) => setHistoryFilterPayMode(e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Modes</option>
                    <option value="IMPS">IMPS</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    {/* <option value="NEFT">NEFT</option>
              <option value="RTGS">RTGS</option>
              <option value="UPI">UPI</option> */}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(historyFilterFromDate || historyFilterToDate || historyFilterPayMode) && (
                <div className="flex justify-end">
                  <button
                    className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      setHistoryFilterFromDate(null);
                      setHistoryFilterToDate(null);
                      setHistoryFilterPayMode('');
                    }}
                  >
                    <Filter className="w-3 h-3 mr-1" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Transaction List */}
            <div className="overflow-y-auto flex-grow p-4">
              {filteredTransactions.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500">
                    No transactions found
                    {(historyFilterFromDate || historyFilterToDate || historyFilterPayMode) && (
                      <span>
                        {' '}for the selected filters
                        {historyFilterFromDate && ` (From: ${formatDate(historyFilterFromDate)})`}
                        {historyFilterToDate && ` (To: ${formatDate(historyFilterToDate)})`}
                        {historyFilterPayMode && ` (Mode: ${historyFilterPayMode})`}
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-gray-100 p-3 border border-gray-300 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">
                          ₹{transaction.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatDateTime(transaction.timestamp)}
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">Mode:</span> {transaction.payMode}
                          {transaction.utrNo && ` (UTR: ${transaction.utrNo})`}
                          {transaction.chequeNumber && ` (Cheque: ${transaction.chequeNumber})`}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Note:</span> {transaction.note || '-'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DailyCollection;