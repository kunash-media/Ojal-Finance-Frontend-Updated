import './AddCustomerForm.css'; // Import custom CSS for additional responsive styles
import { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from '../../context/AuthContext.jsx';

const AddCustomerForm = () => {

    const { user } = useAuth();

    const getBranch = user?.branchName || "NA";

    // State for form data - keeping original structure
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        mobile: '',
        altMobile: '',
        dob: '',
        address: '',
        gender: '',
        pincode: '',
        branch: '',
        documents: {
            aadharCard: null,    // Match backend field name (was aadhaar)
            panCard: null,       // Match backend field name (was pan)
            voterIdImg: null,    // Match backend field name (was voterId)
            passPortImg: null,   // Match backend field name (was photo)
        },
    });

    // Loading state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast notifications state
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false); // State to control loading spinner

    // Branch list state
    const [branchList, setBranchList] = useState([]);
    const [branchLoading, setBranchLoading] = useState(false);

    /**
     * Fetch branch list from backend API
     */
    const fetchBranchList = async () => {
        setBranchLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/admins/get-branch-list', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const branches = await response.json();
                setBranchList(branches);
            } else {
                console.error('Failed to fetch branch list');
                showToastNotification('Failed to load branch list. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error fetching branch list:', error);
            showToastNotification('Network error while loading branches. Please check your connection.', 'error');
        } finally {
            setBranchLoading(false);
        }
    };

    /**
     * useEffect to fetch branch list on component mount
     */
    useEffect(() => {
        fetchBranchList();
    }, []);

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success' or 'error')
     */
    const showToastNotification = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    /**
     * Handle input changes for both text fields and file uploads
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Handle document file uploads - updated field names to match backend
        if (['aadharCard', 'panCard', 'voterIdImg', 'passPortImg'].includes(name)) {
            const file = files[0];
            if (file && !file.type.startsWith('image/')) {
                showToastNotification('Only image files are allowed for documents.', 'error');
                e.target.value = null;
                return;
            }
            setFormData((prev) => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [name]: file,
                },
            }));
        } else {
            // Handle regular text inputs
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    /**
     * Handle form submission with API integration
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setLoading(true);  // Show the spinner

        try {
            // Create FormData object for multipart/form-data request
            const formDataToSend = new FormData();

            // Prepare userData object for backend - exactly matching your payload structure
            const userData = {
                firstName: formData.firstName,
                middleName: formData.middleName || 'NA', // Default to 'NA' if empty
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
                altMobile: formData.altMobile || 'NA',
                gender: formData.gender,
                dob: formData.dob,
                address: formData.address,
                pincode: formData.pincode,
                branch: formData.branch,
            };

            // Add userData as a Blob with proper type
            const userDataBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
            formDataToSend.append('userData', userDataBlob);

            // Add document files to FormData - matching exact backend parameter names
            if (formData.documents.panCard) {
                formDataToSend.append('panCard', formData.documents.panCard);
            }
            if (formData.documents.aadharCard) {
                formDataToSend.append('aadharCard', formData.documents.aadharCard);
            }
            if (formData.documents.passPortImg) {
                formDataToSend.append('passPortImg', formData.documents.passPortImg);
            }
            if (formData.documents.voterIdImg) {
                formDataToSend.append('voterIdImg', formData.documents.voterIdImg);
            }

            // Make API call to backend
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Registration successful:', result);

                // Show success toast notification
                showToastNotification('Customer registered successfully!', 'success');

                // Reset form after successful submission
                resetForm();
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                showToastNotification(errorData.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Network error:', error);
            showToastNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            setLoading(false); // Hide the spinner
            setIsSubmitting(false);
        }
    };

    /**
     * Reset form to initial state
     */
    const resetForm = () => {
        setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            mobile: '',
            altMobile: '',
            dob: '',
            address: '',
            gender: '',
            pincode: '',
            branch: '',
            documents: {
                aadharCard: null,
                panCard: null,
                voterIdImg: null,
                passPortImg: null,
            },
        });

        // Reset file inputs manually
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.value = '';
        });
    };

    /**
     * Remove uploaded document
     * @param {string} docKey - Document key to remove
     */
    const removeDocument = (docKey) => {
        setFormData((prev) => ({
            ...prev,
            documents: {
                ...prev.documents,
                [docKey]: null,
            },
        }));
    };

    return (
        <div className="flex justify-center mb-16 px-4">

            {/* loading spinner */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <ClipLoader color="#00796B" loading={loading} size={100} />
                </div>
            )}
            {/* Custom Toast Notification */}
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 custom-toast ${toastType === 'success' ? 'toast-success' : 'toast-error'}`}>
                    <div className="flex items-center bg-white rounded-lg shadow-lg border px-4 py-3 min-w-80">
                        <span className={`text-xl mr-3 ${toastType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {toastType === 'success' ? '✓' : '✕'}
                        </span>
                        <span className="text-gray-800 flex-1">{toastMessage}</span>
                        <button
                            className="ml-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
                            onClick={() => setShowToast(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Card container with rounded corners and shadow - KEEPING ORIGINAL TAILWIND */}
            <div className="rounded-3xl border border-gray-300 shadow-sm max-w-5xl w-full p-8 sm:p-10"
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)',
                }}>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Form Header with Description */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800"
                            style={{
                                fontFamily: "'Nunito', sans-serif",
                                color: '#135D66'
                            }}>
                            Add Customer
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                            Register a new customer by filling out all required information below.
                            All fields marked with <span className="text-red-600 font-semibold">*</span> are mandatory.
                        </p>
                    </div>

                    {/* Name Fields - KEEPING ORIGINAL TAILWIND GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                First Name <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.firstName}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">Middle Name</span>
                            <input
                                type="text"
                                name="middleName"
                                placeholder="Middle Name"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.middleName}
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Last Name <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.lastName}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>

                    {/* Other Fields - KEEPING ORIGINAL TAILWIND GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Email Id <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.email}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Mobile Number <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile Number"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.mobile}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Alternate Mobile Number
                            </span>
                            <input
                                type="tel"
                                name="altMobile"
                                placeholder="Alternate Mobile Number"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.altMobile}
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">Date of Birth<span className="text-red-600">*</span></span>
                            <input
                                type="date"
                                name="dob"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                onChange={handleChange}
                                value={formData.dob}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Gender <span className="text-red-600">*</span>
                            </span>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                required
                                disabled={isSubmitting}
                            >
                                <option value="" disabled hidden>
                                    Select Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Pincode <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"

                                onChange={handleChange}
                                value={formData.pincode}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                        {/* Branch Dropdown - REPLACED INPUT WITH SELECT */}
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Branch Name <span className="text-red-600">*</span>
                            </span>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                required
                                disabled={isSubmitting || branchLoading}
                            >
                                <option value="" disabled hidden>
                                    {branchLoading ? "Loading branches..." : "Select Branch"}
                                </option>
                                {branchList.map((branch, index) => (
                                    <option key={index} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {/* Address - KEEPING ORIGINAL TAILWIND */}
                        <label className="flex flex-col">
                            <span className="mb-2 font-semibold text-gray-700">
                                Address <span className="text-red-600">*</span>
                            </span>
                            <textarea
                                name="address"
                                placeholder="Address"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                rows="1"
                                onChange={handleChange}
                                value={formData.address}
                                required
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>

                    {/* Document Upload - KEEPING ORIGINAL TAILWIND WITH UPDATED FIELD NAMES */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Upload Documents <span className="text-red-600">*</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { key: 'aadharCard', label: 'Aadhaar Card' },
                                { key: 'panCard', label: 'PAN Card' },
                                { key: 'voterIdImg', label: 'Voter ID' },
                                { key: 'passPortImg', label: 'Passport Size Photo' }
                            ].map(({ key, label }) => (
                                <label key={key} className="flex flex-col">
                                    <span className="mb-2 font-semibold text-gray-700">
                                        {label} (Image only) <span className="text-red-600">*</span>
                                    </span>

                                    {formData.documents[key] ? (
                                        <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-gray-100 shadow-inner">
                                            <span className="truncate max-w-xs">{formData.documents[key].name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(key)}
                                                className="ml-4 text-red-600 font-bold hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={`Remove ${label}`}
                                                disabled={isSubmitting}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="file"
                                            name={key}
                                            accept="image/*"
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button - KEEPING ORIGINAL TAILWIND WITH LOADER */}
                    <button
                        type="submit"
                        className="bg-[#129990] hover:bg-[#096B68] text-white font-semibold py-3 px-8 rounded-lg w-full shadow-md transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="loading-spinner-teal mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerForm;