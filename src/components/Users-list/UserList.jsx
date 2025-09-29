import React, { useState, useEffect, useMemo } from 'react';
import { useUsers } from '../../context/UserContext';
import { Search, Filter, Eye, X, User, Phone, Mail, MapPin, Calendar, Building } from 'lucide-react';
import "./UserList.css";
import * as XLSX from 'xlsx';

const UserList = () => {
    // Context data
    const { users, loading, error, refreshUsers } = useUsers();

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [branchLoading, setBranchLoading] = useState(false);
    const [showExportConfirmation, setShowExportConfirmation] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // Debounced search query
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch branches on component mount
    useEffect(() => {
        const fetchBranches = async () => {
            setBranchLoading(true);
            try {
                const response = await fetch('https://api.ojalmsfoundation.in/api/admins/get-branch-list');
                if (response.ok) {
                    const branchData = await response.json();
                    setBranches(branchData);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setBranchLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // Filter users based on search and branch
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        return users.filter(user => {
            const searchMatch = !debouncedQuery ||
                `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                user.mobile.includes(debouncedQuery) ||
                user.altMobile.includes(debouncedQuery);

            const branchMatch = !selectedBranch || user.branch === selectedBranch;

            return searchMatch && branchMatch;
        });
    }, [users, debouncedQuery, selectedBranch]);

    // Handle view profile
    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowProfile(true);
    };

    // Close profile overlay
    const closeProfile = () => {
        setShowProfile(false);
        setSelectedUser(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle export confirmation
    const handleExportConfirm = () => {
        console.log('Export confirmed, starting Excel generation');
        setExportLoading(true);
        try {
            const worksheetData = filteredUsers.map(user => ({
                'User ID': user.userId,
                'Full Name': `${user.firstName} ${user.middleName !== 'NA' ? user.middleName + ' ' : ''}${user.lastName}`,
                'Gender': user.gender,
                'Date of Birth': formatDate(user.dob),
                'Role': user.role.replace('ROLE_', ''),
                'Created At': user.createdAt,
                'Email': user.email,
                'Primary Mobile': user.mobile,
                'Alternative Mobile': user.altMobile,
                'Address': user.address,
                'Pincode': user.pincode,
                'Branch': user.branch,
                'Pan Card': user.documentStatus.panCard ? 'Verified' : 'Pending',
                'Aadhar Card': user.documentStatus.aadharCard ? 'Verified' : 'Pending',
                'Passport': user.documentStatus.passPortImg ? 'Verified' : 'Pending',
                'Voter ID': user.documentStatus.voterIdImg ? 'Verified' : 'Pending',
                'User Signature': user.documentStatus.userSignatureImg ? 'Verified' : 'Pending'
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            XLSX.writeFile(workbook, 'users_details.xlsx');
            console.log('Excel file generated and downloaded');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        } finally {
            setExportLoading(false);
            setShowExportConfirmation(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-center rounded-lg p-4">
                <p className="text-red-700 m-5">Error loading users: {error}</p>
                <button
                    onClick={refreshUsers}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="user-list-container border border-gray-200 rounded-md" style={{
            background: 'linear-gradient(140deg, #ffffff 0%, #E1F7F5 35%, #ffffff 130%)',
        }}>
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-gray-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h1 className="text-xl font-bold text-gray-800">All Customers ({users?.length})</h1>
                    <button
                        onClick={() => setShowExportConfirmation(true)}
                        className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-500 text-sm font-medium"
                    >
                        Export Records
                    </button>
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full search-filter-container">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:flex-none sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name or mobile..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-600 focus:border-transparent"
                            />
                        </div>

                        {/* Branch Filter */}
                        <div className="relative flex-1 sm:flex-none sm:w-48">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                disabled={branchLoading}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch, index) => (
                                    <option key={index} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto h-[320px]">
                    <table className="w-full">
                        <thead className="bg-gray-200 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Alt Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">DOB</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Pincode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-200"
                                    style={{ position: 'sticky', right: '120px', zIndex: 60, willChange: 'transform' }}>Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-200"
                                    style={{ position: 'sticky', right: '0', zIndex: 60, willChange: 'transform' }}> Action </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {`${user.firstName} ${user.middleName !== 'NA' ? user.middleName + ' ' : ''}${user.lastName}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.mobile}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            {user.altMobile}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                                            {formatDate(user.dob)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            {user.gender}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 hidden xl:table-cell max-w-xs truncate">
                                            {user.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            {user.pincode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap bg-white text-sm text-gray-900"
                                            style={{ position: 'sticky', right: "125px" }}>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.branch}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap bg-white text-sm font-medium"
                                            style={{ position: 'sticky', right: 0 }}>
                                            <button
                                                onClick={() => handleViewProfile(user)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-600">
                Showing {filteredUsers.length} of {users?.length || 0} users
            </div>

            {/* Profile Overlay Modal */}
            {showProfile && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto profile-modal">
                        {/* Modal Header */}
                        <div className="flex bg-gray-100 items-center justify-between p-6 border-b sticky top-0">
                            <div className="flex items-center">
                                <User className="h-6 w-6 text-blue-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Profile - <span>{selectedUser?.firstName} {selectedUser?.lastName}</span></h2>
                            </div>
                            <button
                                onClick={closeProfile}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 modal-body">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Personal Information */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Personal Information
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">User ID</label>
                                                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedUser.userId}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {`${selectedUser.firstName} ${selectedUser.middleName !== 'NA' ? selectedUser.middleName + ' ' : ''}${selectedUser.lastName}`}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Gender</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.gender}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                                <div className="flex items-center mt-1">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{formatDate(selectedUser.dob)}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Role</label>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedUser.role === 'ROLE_ADMIN'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {selectedUser.role.replace('ROLE_', '')}
                                                </span>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Created At</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">User Accounts</h3>
                                        <div className="space-y-4" >
                                            <label className="block text-sm font-medium text-gray-600">Savings Accounts :</label>
                                            <div className="flex items-center justify-between p-1 bg-gray-50 border border-gray-200 rounded ">
                                                <p className="mt-1 text-sm text-gray-900 font-mono"> Total Saving A/C: {selectedUser.savingsCount} | Total Balance : ₹{selectedUser.totalSavingsBalance.toLocaleString()}</p>
                                            </div>
                                            <label className="block text-sm font-medium text-gray-600">Recurring Deposits (RD) :</label>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                                                <p className="mt-1 text-sm text-gray-900 font-mono"> Total RDs A/C: {selectedUser.rdCount} | Total Balance : ₹{selectedUser.totalRdBalance.toLocaleString()}</p>
                                            </div>
                                            <label className="block text-sm font-medium text-gray-600">Fixed Deposits (FD) :</label>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                                                <p className="mt-1 text-sm text-gray-900 font-mono"> Total FDs A/C : {selectedUser.fdCount} | Total Balance : ₹{selectedUser.totalFdBalance.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Contact & Location */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Contact & Location
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                                <div className="flex items-center mt-1">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Primary Mobile</label>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedUser.mobile}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Alternative Mobile</label>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedUser.altMobile}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Address</label>
                                                <div className="flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-gray-900">{selectedUser.address}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Pincode</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.pincode}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Branch</label>
                                                <div className="flex items-center mt-1">
                                                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {selectedUser.branch}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Status */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Document Status
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3 document-status-grid">
                                            {Object.entries(selectedUser.documentStatus).map(([doc, status]) => (
                                                <div key={doc} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                                                    <span className="text-sm font-medium text-gray-600 capitalize">
                                                        {doc.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {status ? 'Verified' : 'Pending'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={closeProfile}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Confirmation Overlay */}
            {showExportConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Export Users</h2>
                            <button
                                onClick={() => setShowExportConfirmation(false)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            {exportLoading ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                    <span className="ml-2 text-gray-600">Exporting...</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to export {filteredUsers.length} user records to an Excel file?
                                </p>
                            )}
                        </div>
                        {!exportLoading && (
                            <div className="p-4 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => setShowExportConfirmation(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleExportConfirm}
                                    className="px-4 py-2 bg-purple-800 text-white rounded-md text-sm font-medium hover:bg-purple-500"
                                >
                                    Yes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;