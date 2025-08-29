
import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./RecurringDeposit.css";

const RecurringDeposit = () => {
  // State for user data - This will be replaced with context API data in production
  const [users, setUsers] = useState([
    {
      id: "U55588",
      firstName: "John",
      lastName: "Doe",
      mobile: "9876543210",
      email: "john.doe@example.com",
      address: "123 Main St, City",
      branch: "Central Branch",
      date: "2025-05-15"
    },
    {
      id: "U55589",
      firstName: "Jane",
      lastName: "Smith",
      mobile: "8765432109",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Town",
      branch: "North Branch",
      date: "2025-05-16"
    },
    {
      id: "U55590",
      firstName: "Robert",
      lastName: "Johnson",
      mobile: "7654321098",
      email: "robert.j@example.com",
      address: "789 Pine Rd, Village",
      branch: "South Branch",
      date: "2025-05-17"
    },
    {
      id: "U55591",
      firstName: "Emily",
      lastName: "Brown",
      mobile: "6543210987",
      email: "emily.b@example.com",
      address: "101 Elm St, County",
      branch: "East Branch",
      date: "2025-05-18"
    },
    {
      id: "U55592",
      firstName: "Michael",
      lastName: "Wilson",
      mobile: "5432109876",
      email: "michael.w@example.com",
      address: "202 Maple Dr, District",
      branch: "West Branch",
      date: "2025-05-19"
    }
  ]);

  // State variables for UI controls
  const [isRdFormOpen, setIsRdFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rdFormData, setRdFormData] = useState({
    depositAmount: "",
    interestRate: "",
    tenureMonths: ""
  });
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulating API fetch for users - Will be replaced with context API
  useEffect(() => {
    // Simulated fetch delay
    const timer = setTimeout(() => {
      setFilteredUsers(users);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [users]);

  // Debounce helper function for search
  const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, type) => {
      if (term.length < 2) {
        setFilteredUsers(users);
        return;
      }

      const filtered = users.filter(user => {
        if (type === "name") {
          return (
            user.firstName.toLowerCase().includes(term.toLowerCase()) ||
            user.lastName.toLowerCase().includes(term.toLowerCase())
          );
        } else if (type === "mobile") {
          return user.mobile.includes(term);
        }
        return true;
      });
      
      setFilteredUsers(filtered);
    }, 300),
    [users]
  );

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchTerm, searchType);
  }, [searchTerm, searchType, debouncedSearch]);

  // Handle opening the RD form for a specific user
  const handleAddRD = (user) => {
    setSelectedUser(user);
    setRdFormData({
      depositAmount: "",
      interestRate: "",
      tenureMonths: ""
    });
    setIsRdFormOpen(true);
  };

  // Handle RD form input changes
  const handleRdFormChange = (e) => {
    const { name, value } = e.target;
    setRdFormData({
      ...rdFormData,
      [name]: value
    });
  };

  // Handle RD form submission
  const handleRdFormSubmit = (e) => {
    e.preventDefault();
    setIsRdFormOpen(false);
    setIsConfirmModalOpen(true);
  };

  // Handle final confirmation and API call
  const handleConfirm = async () => {
    try {
      // API endpoint construction with selected user ID
      const apiUrl = `http://localhost:8080/api/accounts/${selectedUser.id}`;
      
      // Prepare the payload according to the API requirements
      const payload = {
        depositAmount: parseFloat(rdFormData.depositAmount),
        interestRate: parseFloat(rdFormData.interestRate),
        tenureMonths: parseInt(rdFormData.tenureMonths)
      };

      // Uncomment this in production when API is ready
      /*
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create recurring deposit account');
      }

      const data = await response.json();
      */

      // For development: log the API call that would be made
      console.log('API call would be made to:', apiUrl);
      console.log('With payload:', payload);
      
      // Close confirmation modal
      setIsConfirmModalOpen(false);
      
      // Show success notification
      toast.success('Recurring Deposit created successfully!');
      
      // Reset form data
      setRdFormData({
        depositAmount: "",
        interestRate: "",
        tenureMonths: ""
      });
      
    } catch (error) {
      // Close confirmation modal
      setIsConfirmModalOpen(false);
      
      // Show error notification
      toast.error('Failed to create Recurring Deposit: ' + error.message);
    }
  };

  // Calculate approximate maturity amount
  const calculateMaturityAmount = () => {
    const P = parseFloat(rdFormData.depositAmount) || 0;
    const r = parseFloat(rdFormData.interestRate) || 0;
    const n = parseInt(rdFormData.tenureMonths) || 0;
    
    // Simple maturity calculation (can be refined based on actual formula)
    const maturityAmount = P * n * (1 + (r / 100 / 12 * n) / 2);
    return maturityAmount.toFixed(2);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-300 shadow-sm"
         style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)',
          }}>
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Recurring Deposit</h1>
        <p className="text-gray-600">
          Create recurring deposit accounts for your clients and help them grow their savings with our 
          competitive interest rates. Regular monthly deposits over a fixed period can help achieve financial goals 
          with the security of guaranteed returns.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rd-search-container">
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
      <div className="rd-table-container">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="sticky top-0 z-50">
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">First Name</th>
              <th className="py-3 px-4 border-b text-left">Last Name</th>
              <th className="py-3 px-4 border-b text-left">Mobile</th>
              <th className="py-3 px-4 border-b text-left">Email</th>
              <th className="py-3 px-4 border-b text-left">Address</th>
              <th className="py-3 px-4 border-b text-left">Branch</th>
              <th className="py-3 px-4 border-b text-left">Date</th>
              <th className="py-3 px-4 border-b text-center bg-slate-100"
                style={{position: 'sticky', right: 0, zIndex: 60}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">Loading...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{user.firstName}</td>
                  <td className="py-3 px-4 border-b">{user.lastName}</td>
                  <td className="py-3 px-4 border-b">{user.mobile}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">{user.address}</td>
                  <td className="py-3 px-4 border-b">{user.branch}</td>
                  <td className="py-3 px-4 border-b">{user.date}</td>
                  <td className="py-2 px-4 border-b text-center bg-gray-50"
                     style={{position: 'sticky', right: 0}}>
                    <button
                      className="bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700 transition-colors"
                      onClick={() => handleAddRD(user)}
                    >
                      Add RD
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RD Form Modal */}
      {isRdFormOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-modal-container">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-xl font-bold text-teal-700">Create Recurring Deposit for {selectedUser?.firstName} {selectedUser?.lastName}</h2>
              <button 
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setIsRdFormOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleRdFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="depositAmount">Deposit Amount (₹)</label>
                <input
                  type="number"
                  id="depositAmount"
                  name="depositAmount"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                  value={rdFormData.depositAmount}
                  onChange={handleRdFormChange}
                  required
                  min="100"
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
                  value={rdFormData.interestRate}
                  onChange={handleRdFormChange}
                  required
                  min="1"
                  max="10"
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
                  value={rdFormData.tenureMonths}
                  onChange={handleRdFormChange}
                  required
                  min="6"
                  max="120"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setIsRdFormOpen(false)}
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
      {isConfirmModalOpen && (
        <div className="rd-modal-overlay">
          <div className="rd-modal-container">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-xl font-bold text-teal-700">Confirm Recurring Deposit Details</h2>
              <button 
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="rd-confirm-details">
              <h3 className="mb-3 text-lg font-semibold">User Information</h3>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Name:</span>
                <span className="rd-detail-value">{selectedUser?.firstName} {selectedUser?.lastName}</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Mobile:</span>
                <span className="rd-detail-value">{selectedUser?.mobile}</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Email:</span>
                <span className="rd-detail-value">{selectedUser?.email}</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Branch:</span>
                <span className="rd-detail-value">{selectedUser?.branch}</span>
              </div>
              
              <h3 className="mb-3 mt-4 text-lg font-semibold">RD Details</h3>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Deposit Amount:</span>
                <span className="rd-detail-value">₹{rdFormData.depositAmount}</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Interest Rate:</span>
                <span className="rd-detail-value">{rdFormData.interestRate}%</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Tenure:</span>
                <span className="rd-detail-value">{rdFormData.tenureMonths} months</span>
              </div>
              <div className="rd-detail-item">
                <span className="rd-detail-label">Maturity Amount (Approx):</span>
                <span className="rd-detail-value">₹{calculateMaturityAmount()}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container - Using react-toastify */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RecurringDeposit;