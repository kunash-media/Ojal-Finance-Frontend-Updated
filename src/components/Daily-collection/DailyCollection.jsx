import "./DailyCollection.css";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '/src/assets/ojal-logo.png';
import { useState, useEffect, useCallback } from "react";
import { Calendar, X, CreditCard, History, Filter, ArrowDownCircle } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  // State management
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openPayForm, setOpenPayForm] = useState(false);
  const [openWithdrawForm, setOpenWithdrawForm] = useState(false); // Added for withdrawal modal
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [historyFilterFromDate, setHistoryFilterFromDate] = useState(null);
  const [historyFilterToDate, setHistoryFilterToDate] = useState(null);
  const [historyFilterPayMode, setHistoryFilterPayMode] = useState('');
  const [isWithdrawal, setIsWithdrawal] = useState(false); // Added to track withdrawal vs. credit in confirmation modal

  const [paymentData, setPaymentData] = useState({
    amount: "",
    payMode: "",
    utrNo: "",
    chequeNumber: "",
    note: ""
  });

  // Transform API data to match frontend structure
  const transformAccountData = (apiData) => {
    return apiData.map(account => ({
      userId: account.id.toString(),
      name: account.name,
      accountNumber: account.accountNumber,
      createdAt: account.createdAt,
      accountStatus: account.status === 'ACTIVE' ? 'Active' : 'Inactive',
      balance: account.currentBalance,
      interestRate: account.interestRate,
      transactions: [] // Will be populated when fetching transactions
    }));
  };

  const transformTransactionData = (apiData) => {
    return apiData.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      payMode: transaction.payMode,
      utrNo: transaction.utrNo !== "NA" ? transaction.utrNo : null,
      cash: transaction.cash !== "NA" ? transaction.cash : null,
      chequeNumber: transaction.chequeNumber !== "NA" ? transaction.chequeNumber : null,
      note: transaction.note !== "NO" ? transaction.note : "",
      timestamp: transaction.createdAt,
      transactionType: transaction.transactionType
    }));
  };

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch('https://api.ojalmsfoundation.in/api/saving/get-all-savings-users', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      const transformedData = transformAccountData(data);
      setAccounts(transformedData);
      setFilteredAccounts(transformedData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    }
  };

  // Fetch transactions for a specific account
  const fetchTransactions = async (accountNumber) => {
    try {
      const response = await fetch(`https://api.ojalmsfoundation.in/api/saving/transactions/get-user-transactions/${accountNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      console.log("Transaction Data fetched of user:", data);
      return transformTransactionData(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      return [];
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter transactions based on date range and payment mode
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

  // Search functionality
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

  useEffect(() => {
    if (accounts.length > 0) {
      setFilteredAccounts(accounts);
    }
  }, [accounts]);

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

  // Handle pay button click
  const handlePayClick = (account) => {
    setSelectedAccount(account);
    setPaymentData({
      amount: "",
      payMode: "CASH",
      utrNo: "",
      chequeNumber: "",
      note: ""
    });
    setIsWithdrawal(false); // Set to false for credit
    setOpenPayForm(true);
  };

  // Handle withdraw button click
  const handleWithdrawClick = (account) => {
    setSelectedAccount(account);
    setPaymentData({
      amount: "",
      payMode: "CASH",
      utrNo: "",
      chequeNumber: "",
      note: ""
    });
    setIsWithdrawal(true); // Set to true for withdrawal
    setOpenWithdrawForm(true);
  };

  // Handle history button click
  const handleHistoryClick = async (account) => {
    setSelectedAccount(account);
    
    // Fetch transactions for the selected account
    const transactions = await fetchTransactions(account.accountNumber);
    
    // Update selected account with transactions
    const updatedAccount = {
      ...account,
      transactions: transactions
    };
    
    setSelectedAccount(updatedAccount);
    
    // Set filtered transactions (initially all transactions, sorted)
    setFilteredTransactions([...transactions].sort((a, b) =>
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
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setOpenConfirmModal(true);
  };

  // Handle withdrawal form submission
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(paymentData.amount) > selectedAccount.balance) {
      toast.error("Withdrawal amount exceeds account balance");
      return;
    }
    setOpenConfirmModal(true);
  };

  // Handle final submission (for both credit and withdrawal)
const handleFinalSubmit = async () => {
  try {
    // Prepare payload for API
    const payload = {
      amount: parseFloat(paymentData.amount),
      payMode: paymentData.payMode,
      utrNo: paymentData.payMode === "IMPS" ? paymentData.utrNo : "NA",
      cash: paymentData.payMode === "CASH" ? paymentData.amount.toString() : "NA",
      chequeNumber: paymentData.payMode === "Cheque" ? paymentData.chequeNumber : "NA",
      note: paymentData.note || "NO",
      transactionType: isWithdrawal ? "DEBIT" : "CREDIT" // Add transactionType to payload
    };

    // Determine API endpoint based on withdrawal or credit
    const apiUrl = isWithdrawal
      ? `https://api.ojalmsfoundation.in/api/saving/${selectedAccount.accountNumber}/withdraw`
      : `https://api.ojalmsfoundation.in/api/saving/transactions/create-transaction/${selectedAccount.accountNumber}`;

    // Make API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Failed to submit ${isWithdrawal ? 'withdrawal' : 'payment'}`);

    // Fetch updated transactions to get backend-provided createdAt
    const updatedTransactions = await fetchTransactions(selectedAccount.accountNumber);

    // Update local state
    const updatedAccounts = accounts.map(account => {
      if (account.accountNumber === selectedAccount.accountNumber) {
        return {
          ...account,
          transactions: updatedTransactions,
          balance: isWithdrawal
            ? account.balance - parseFloat(paymentData.amount)
            : account.balance + parseFloat(paymentData.amount)
        };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setFilteredAccounts(updatedAccounts);
    // Update selectedAccount if history modal is open
    if (openHistoryModal) {
      setSelectedAccount(prev => ({
        ...prev,
        transactions: updatedTransactions,
        balance: isWithdrawal
          ? prev.balance - parseFloat(paymentData.amount)
          : prev.balance + parseFloat(paymentData.amount)
      }));
      setFilteredTransactions([...updatedTransactions].sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp)));
    }

    setOpenConfirmModal(false);
    setOpenPayForm(false);
    setOpenWithdrawForm(false);
    toast.success(`Amount ₹${parseFloat(paymentData.amount).toFixed(2)} ${isWithdrawal ? 'withdrawal' : 'payment'} successfully!`);
  } catch (error) {
    console.error(`Error submitting ${isWithdrawal ? 'withdrawal' : 'payment'}:`, error);
    toast.error(`Failed to submit ${isWithdrawal ? 'withdrawal' : 'payment'}`);
  }
};

  // Handle final submission (for both credit and withdrawal)
  // const handleFinalSubmit = async () => {
  //   try {
  //     // Prepare payload for API
  //     const payload = {
  //       amount: parseFloat(paymentData.amount),
  //       payMode: paymentData.payMode,
  //       utrNo: paymentData.payMode === "IMPS" ? paymentData.utrNo : "NA",
  //       cash: paymentData.payMode === "CASH" ? paymentData.amount.toString() : "NA",
  //       chequeNumber: paymentData.payMode === "Cheque" ? paymentData.chequeNumber : "NA",
  //       note: paymentData.note || "NO"
  //     };

  //     // Determine API endpoint based on withdrawal or credit
  //     const apiUrl = isWithdrawal
  //       ? `https://api.ojalmsfoundation.in/api/saving/${selectedAccount.accountNumber}/withdraw`
  //       : `https://api.ojalmsfoundation.in/api/saving/transactions/create-transaction/${selectedAccount.accountNumber}`;

  //     // Make API call
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) throw new Error(`Failed to submit ${isWithdrawal ? 'withdrawal' : 'payment'}`);

  //     // Update local state
  //     const newTransaction = {
  //       id: Date.now(), // Ideally, get this from the API response
  //       amount: parseFloat(paymentData.amount),
  //       payMode: paymentData.payMode,
  //       utrNo: paymentData.payMode === "IMPS" ? paymentData.utrNo : null,
  //       cash: paymentData.payMode === "CASH" ? paymentData.amount.toString() : null,
  //       chequeNumber: paymentData.payMode === "Cheque" ? paymentData.chequeNumber : null,
  //       note: paymentData.note || "",
  //       timestamp: new Date().toISOString(),
  //       transactionType: isWithdrawal ? "DEBIT" : "CREDIT" // Set transactionType based on action
  //     };

  //     const updatedAccounts = accounts.map(account => {
  //       if (account.accountNumber === selectedAccount.accountNumber) {
  //         return {
  //           ...account,
  //           transactions: [...(account.transactions || []), newTransaction],
  //           balance: isWithdrawal
  //             ? account.balance - parseFloat(paymentData.amount)
  //             : account.balance + parseFloat(paymentData.amount)
  //         };
  //       }
  //       return account;
  //     });

  //     setAccounts(updatedAccounts);
  //     setFilteredAccounts(updatedAccounts);
  //     setOpenConfirmModal(false);
  //     setOpenPayForm(false);
  //     setOpenWithdrawForm(false);
  //     toast.success(`Amount ₹${parseFloat(paymentData.amount).toFixed(2)} ${isWithdrawal ? 'withdrawal' : 'payment'} successfully!`);
  //   } catch (error) {
  //     console.error(`Error submitting ${isWithdrawal ? 'withdrawal' : 'payment'}:`, error);
  //     toast.error(`Failed to submit ${isWithdrawal ? 'withdrawal' : 'payment'}`);
  //   }
  // };

 // Helper function to parse backend timestamp to a valid Date object
// Helper function to parse backend timestamp to a valid Date object


const parseTimestamp = (timestamp) => {
  try {
    if (typeof timestamp === 'string' && (timestamp.includes(' AM') || timestamp.includes(' PM'))) {
      const [datePart, timePart, period] = timestamp.trim().split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      let [hours, minutes] = timePart.split(':').slice(0, 2).map(Number); // Handle potential seconds
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      const date = new Date(year, month - 1, day, hours, minutes);
      if (isNaN(date.getTime())) throw new Error('Invalid Date object');
      return date;
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) throw new Error('Invalid Date object');
    return date;
  } catch (error) {
    console.error('Error parsing timestamp for Date:', timestamp, error.message);
    return new Date(0); // Fallback to epoch for sorting/filtering
  }
};

// Helper function to format date and time
const formatDateTime = (timestamp) => {
  try {
    let date;
    if (typeof timestamp === 'string' && (timestamp.includes(' AM') || timestamp.includes(' PM'))) {
      const [datePart, timePart, period] = timestamp.trim().split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      let [hours, minutes] = timePart.split(':').slice(0, 2).map(Number); // Handle potential seconds
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      date = new Date(year, month - 1, day, hours, minutes);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) throw new Error('Invalid Date object');
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting timestamp:', timestamp, error.message);
    return 'Invalid Date';
  }
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


const downloadStatement = () => {
  if (!selectedAccount || filteredTransactions.length === 0) {
    toast.error('No transactions available to download');
    return;
  }

  const doc = new jsPDF();

  // Add logo using the imported image
  doc.addImage(logoImg, 'PNG', 10, 10, 30, 30); // Reduced logo size from 40x40 to 30x30

  // Bank header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OJAL MICRO SERVICE FOUNDATION', 60, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Statement of Saving Account', 60, 28);
  doc.text('Address : SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune - 411015', 60, 34);
  doc.text('Email : ojalmicroservicefoundation.obs@gmail.com | Phone: +91-7499552539', 60, 40);

  // Account details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Holder :', 10, 60);
  doc.text('Account Number :', 10, 68);
  doc.text('Statement Date :', 10, 76);
  doc.text('Total Balance :', 10, 84); // Add total balance label
  doc.setFont('helvetica', 'normal');
  doc.text(selectedAccount.name, 50, 60);
  doc.text(selectedAccount.accountNumber, 50, 68);
  doc.text(new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }), 50, 76);
  doc.text(selectedAccount.balance.toFixed(2), 50, 84); // Add total balance value

  // Transaction table
  const tableData = filteredTransactions.map(t => [
    formatDateTime(t.timestamp),
    t.amount.toFixed(2), // Show only numeric amount, no rupee symbol
    t.transactionType, // DEBIT or CREDIT
    t.payMode,
    t.utrNo && t.utrNo !== 'NA' ? t.utrNo : t.chequeNumber && t.chequeNumber !== 'NA' ? t.chequeNumber : '-'
  ]);

  autoTable(doc, {
    startY: 100, // Increased from 94 to 100 for more space above table
    head: [['Date & Time', 'Amount', 'Type', 'Mode', 'Reference']],
    body: tableData,
    theme: 'grid',
    margin: { left: 25, right: 3, top: 10, bottom: 10 }, // Keep adjusted margins for centering
    columnStyles: {
      0: { cellWidth: 40 }, // Date & Time
      1: { cellWidth: 30 }, // Amount
      2: { cellWidth: 20 }, // Type (DEBIT/CREDIT)
      3: { cellWidth: 20 }, // Mode
      4: { cellWidth: 50, overflow: 'ellipsize' } // Reference (truncate long strings like UTR)
    },
    styles: {
      fontSize: 9, // Reduce font size to help fit content
      cellPadding: 3,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      overflow: 'linebreak' // Default overflow for all cells
    },
    headStyles: {
      fillColor: [0, 128, 128], // Teal color matching your theme
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' });
    doc.text('Generated by OJAL MSF', 10, 287);
  }

  // Save the PDF
  doc.save(`Statement_${selectedAccount.accountNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
};
  
  // Rest of the JSX remains exactly the same as the original code
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
          
          {/* Updated table body with Withdraw button */}
          <tbody>
            { accounts.length !== 0 && filteredAccounts.length !== 0 ? (filteredAccounts.map((account) => (
              <tr
                key={account.userId}
                className={`border-b ${account.accountStatus === 'Active' ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-5">{account.userId}</td>
                <td className="py-3 px-5">{account.name}</td>
                <td className="py-3 px-5">{account.accountNumber}</td>
                <td className="py-3 px-5">{formatDateTime(account.createdAt)}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-1 rounded-full text-xs ${account.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {account.accountStatus}
                  </span>
                </td>
                <td className="py-3 px-5">₹{account.balance.toFixed(2)}</td>
                <td className="py-3 px-4">{account.interestRate}%</td>
                <td className="py-3 px-4 space-x-2 bg-white"
                  style={{ position: 'sticky', right: 0 }}>
                  <button
                    className="bg-teal-600 m-2 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm flex items-center"
                    onClick={() => handlePayClick(account)}
                    disabled={account.accountStatus !== 'Active'}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Credit
                  </button>
                  <button
                    className="bg-red-600 m-2 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                    onClick={() => handleWithdrawClick(account)}
                    disabled={account.accountStatus !== 'Active'}
                  >
                    <ArrowDownCircle className="w-4 h-4 mr-1" />
                    Withdraw
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
            ))) : <tr>
                   <td colSpan="8" className="text-semibold text-center align-middle py-4">No User Found!!</td>
              </tr>}
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
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="CASH">Cash</option>
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
                    placeholder="Enter UTR Number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                    placeholder="Enter Cheque Number"
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                  placeholder="Enter Note...."
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
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

      {/* Withdrawal Form Modal */}
      {openWithdrawForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
              <h3 className="text-lg font-medium">Record Withdrawal</h3>
              <button onClick={() => setOpenWithdrawForm(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-4">
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
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="CASH">Cash</option>
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
                    placeholder="Enter UTR Number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
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
                    placeholder="Enter Cheque Number"
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
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
                  placeholder="Enter Note...."
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  rows="2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenWithdrawForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
            <div className={`${isWithdrawal ? 'bg-red-600' : 'bg-teal-600'} text-white px-4 py-3 flex justify-between items-center rounded-t-lg`}>
              <h3 className="text-lg font-medium">{isWithdrawal ? 'Confirm Withdrawal' : 'Confirm Payment'}</h3>
              <button onClick={() => setOpenConfirmModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {selectedAccount && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold mb-2">{isWithdrawal ? 'Withdrawal' : 'Payment'} Details</h4>
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
                Please review the {isWithdrawal ? 'withdrawal' : 'payment'} details above before confirming. This action cannot be undone.
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
                  className={`px-4 py-2 ${isWithdrawal ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded`}
                >
                  Confirm {isWithdrawal ? 'Withdrawal' : 'Payment'}
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
                <p className="text-md font-semibold">
                  Total Balance: <span className="bg-purple-700 px-1 text-sm rounded-lg border-2  border-purple-200 ">{selectedAccount && selectedAccount.balance.toFixed(2)}</span>
                </p>
                <button
                  onClick={downloadStatement}
                  className="mt-2 bg-teal-700 text-white px-3 py-1 rounded text-sm flex items-center hover:bg-teal-800"
                >
                  <ArrowDownCircle className="w-4 h-4 mr-1" />
                  Download Statement
                </button>
              </div>
              <button onClick={() => setOpenHistoryModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enhanced Filter Section */}
            <div className="sticky top-14 z-10 bg-white border-b px-4 py-3">
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
                    <option value="CASH">Cash</option>
                    <option value="IMPS">IMPS</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {(historyFilterFromDate || historyFilterToDate || historyFilterPayMode) && (
                <div className="flex justify-end">
                  <button
                    className="text-sm px-3 py-1 text-teal-600 hover:text-teal-800 flex items-center"
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
                  {console.log('filteredTransactions:', filteredTransactions)}
                  {filteredTransactions.map((transaction) => {
                    console.log('Transaction ID:', transaction.id, 'Type:', transaction.transactionType);
                    return (
                      <div
                        key={transaction.id}
                        className="bg-gray-100 p-3 border border-gray-300 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold">
                            {transaction.transactionType?.toUpperCase() === 'CREDIT' ? (
                              <span className="text-green-500 text-md font-semibold">CREDIT : + </span>
                            ) : (
                              <span className="text-red-500 text-md font-semibold">DEBIT : - </span>
                            )}
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatDateTime(transaction.timestamp)}
                          </span>
                        </div>
                        <hr className="my-1" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-semibold">Mode:</span> {transaction.payMode}
                            <span className="font-semibold">
                              {transaction.utrNo && transaction.utrNo !== 'NA' && ` (UTR No: ${transaction.utrNo})`}
                              {transaction.chequeNumber && transaction.chequeNumber !== 'NA' && ` (Cheque No: ${transaction.chequeNumber})`}
                            </span>
                          </p>
                          <p className="text-gray-700">
                            <span className="font-bold">Note:</span>{' '}
                            <span className="font-semibold text-purple-800">{transaction.note || 'no note'}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DailyCollection;