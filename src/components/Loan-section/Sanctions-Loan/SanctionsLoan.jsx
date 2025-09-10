import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Eye, X, User, Phone, MapPin, Calendar, Building } from 'lucide-react';
import "./SanctionsLoan.css"; 

const SanctionsLoan = () => {
    // State management
    const [loans, setLoans] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showImage, setShowImage] = useState(null);
    const [branchLoading, setBranchLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    // const [documentError, setDocumentError] = useState(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch branches and loans
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch branches
                const branchResponse = await fetch('http://localhost:8081/api/admins/get-branch-list');
                if (branchResponse.ok) {
                    const branchData = await branchResponse.json();
                    setBranches(branchData);
                }

                // Fetch loans
                const loanResponse = await fetch('http://localhost:8081/api/loans/get-all-loans');

                
                if (loanResponse.ok) {
                    const loanData = await loanResponse.json();
                    setLoans(loanData);
                }
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
                setBranchLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter loans based on search and branch
    const filteredLoans = useMemo(() => {
        if (!loans) return [];

        return loans.filter(loan => {
            const searchMatch = !debouncedQuery ||
                loan.applicationNo.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                loan.memberName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                loan.mobile.includes(debouncedQuery);

            const branchMatch = !selectedBranch || loan.branchName === selectedBranch;

            return searchMatch && branchMatch;
        });
    }, [loans, debouncedQuery, selectedBranch]);

    // Handle view profile
    const handleViewProfile = (loan) => {
        setSelectedLoan(loan);
        setShowProfile(true);
    };

    // Handle view image
    const handleViewImage = (imageUrl) => {
        setShowImage(imageUrl);
    };

    // Close profile overlay
    const closeProfile = () => {
        setShowProfile(false);
        setSelectedLoan(null);
        setShowImage(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading loans...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-center rounded-lg p-4 ">
                <p className="text-red-700 m-5">Error loading loans: {error}</p>
                <button
                    onClick={() => setLoading(true)}
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
                    <h1 className="text-xl font-bold text-gray-800">All Sanctioned Loans ({loans?.length})</h1>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full search-filter-container">
                        <div className="relative flex-1 sm:flex-none sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by application no or member name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-600 focus:border-transparent"
                            />
                        </div>

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

            {/* Loans Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto h-[320px]">
                    <table className="w-full">
                        <thead className="bg-gray-200 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Member Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Purpose Of Loan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Loan Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">ROI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">Applied Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-200"
                                    style={{ position: 'sticky', right: '120px', zIndex: 60, willChange: 'transform' }}>Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-200"
                                    style={{ position: 'sticky', right: '0', zIndex: 60, willChange: 'transform' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                                        No loans found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.applicationNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.memberName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{loan.purposeOfLoan}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{loan.loanAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{loan.roi}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">{formatDate(loan.appliedDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{loan.mobile}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 hidden xl:table-cell max-w-xs truncate">{loan.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap bg-white text-sm text-gray-900"
                                            style={{ position: 'sticky', right: "125px" }}>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {loan.branchName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap bg-white text-sm font-medium"
                                            style={{ position: 'sticky', right:0 }}>
                                            <button
                                                onClick={() => handleViewProfile(loan)}
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
                Showing {filteredLoans.length} of {loans?.length || 0} loans
            </div>

            {/* Profile Overlay Modal */}
            {showProfile && selectedLoan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto profile-modal">
                        {/* Modal Header */}
                        <div className="flex bg-gray-100 items-center justify-between p-6 border-b sticky top-0">
                            <div className="flex items-center">
                                <User className="h-6 w-6 text-blue-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Loan Details - <span>{selectedLoan.applicationNo}</span></h2>
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
                                {/* Left Column - Loan Information */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Loan Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Application No</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.applicationNo}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Purpose of Loan</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.purposeOfLoan}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Loan Scheme</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.loanScheme || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Loan Amount</label>
                                                <p className="mt-1 text-sm text-gray-900">₹{selectedLoan.loanAmount.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">ROI</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.roi}%</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Applied Date</label>
                                                <div className="flex items-center mt-1">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{formatDate(selectedLoan.appliedDate)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Tenure</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.tenure} months</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">EMI Amount</label>
                                                <p className="mt-1 text-sm text-gray-900">₹{selectedLoan.emiAmount.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Processing Fee</label>
                                                <p className="mt-1 text-sm text-gray-900">₹{selectedLoan.processingFee.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Disbursed Amount</label>
                                                <p className="mt-1 text-sm text-gray-900">₹{selectedLoan.disbursedAmount.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Documents
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleViewImage(selectedLoan.photoUrl)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                View Photo
                                            </button>
                                            <button
                                                onClick={() => handleViewImage(selectedLoan.applicantSignatureUrl)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                View Applicant Signature
                                            </button>
                                            <button
                                                onClick={() => handleViewImage(selectedLoan.guarantorSignatureUrl)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                View Guarantor Signature
                                            </button>
                                            <button
                                                onClick={() => handleViewImage(selectedLoan.branchSealUrl)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                View Branch Seal
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Member & Documents */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Member Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Member Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.memberName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Father's Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.fatherName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Mobile</label>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.mobile}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Date of Joining</label>
                                                <div className="flex items-center mt-1">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{formatDate(selectedLoan.dateOfJoining)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Member Type</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.memberType}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Branch</label>
                                                <div className="flex items-center mt-1">
                                                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {selectedLoan.branchName}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Address</label>
                                                <div className="flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.address}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">PAN Number</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.panNumber}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Aadhaar Number</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.adhaarNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                            Guarantor & Nominee
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Guarantor Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.grantorName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Guarantor Address</label>
                                                <div className="flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.grantorAddress}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Guarantor Mobile</label>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.grantorMobile}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Nominee Name</label>
                                                <p className="mt-1 text-sm text-gray-900">{selectedLoan.nomineeName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Nominee Address</label>
                                                <div className="flex items-start mt-1">
                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.nomineeAddress}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Nominee Mobile</label>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900">{selectedLoan.nomineeMobile}</p>
                                                </div>
                                            </div>
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

            {/* Image Overlay Modal */}
            {showImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[70vh] p-4 relative">
                        <button
                            onClick={() => setShowImage(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="flex items-center justify-center h-full">
                            {showImage ? (
                                <img
                                    src={showImage}
                                    alt="Document"
                                    className="max-w-full max-h-[60vh] object-contain"
                                    onError={() => setShowImage(null)}
                                />
                            ) : (
                                <p className="text-gray-500 text-center">No document found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SanctionsLoan;