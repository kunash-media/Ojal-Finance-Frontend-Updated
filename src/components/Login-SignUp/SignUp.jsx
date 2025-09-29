import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './style/button';
import { Input } from './style/input';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        gender: '',
        phone: '',
        altPhone: '',
        branchName: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate the field if it's not branchName
        if (name !== 'branchName') {
            validateField(name, value);
        }
    };

    // Validate one field at a time
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'fullName':
                if (!value.trim()) error = 'Full name is required.';
                break;
            case 'username':
                if (!value.trim()) error = 'Username is required.';
                break;
            case 'email':
                if (!value.includes('@')) error = 'Enter a valid email address.';
                break;
            case 'gender':
                if (!value) error = 'Please select a gender.';
                break;
            case 'phone':
                if (!/^\d{10}$/.test(value)) error = 'Phone must be 10 digits.';
                break;
            case 'altPhone':
                if (value && !/^\d{10}$/.test(value)) error = 'Alt phone must be 10 digits.';
                break;
            case 'password':
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(value)) {
                    error = 'Password must be at least 8 characters, include a number, a letter, and a special character.';
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) error = 'Passwords do not match.';
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Final validation on submit
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!formData.username.trim()) newErrors.username = 'Username is required.';
        if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address.';
        if (!formData.gender) newErrors.gender = 'Please select a gender.';
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits.';
        if (formData.altPhone && !/^\d{10}$/.test(formData.altPhone)) newErrors.altPhone = 'Alt phone must be 10 digits.';

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters, include a number, a letter, and a special character.';
        }

        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // Prepare payload for backend
            const payload = {
                fullName: formData.fullName,
                phone: formData.phone,
                altPhone: formData.altPhone || formData.phone, // Use altPhone if provided, else use phone
                email: formData.email,
                gender: formData.gender,
                branchName: formData.branchName,
                username: formData.username,
                password: formData.password
            };

            const response = await fetch('https://api.ojalmsfoundation.in/api/admins/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Something went wrong!');
                return;
            }

            toast.success('Account created successfully!');
            setTimeout(() => navigate('/'), 4000);
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Failed to connect to server.');
        }
    };

   return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-8 md:py-12"
        style={{ background: 'linear-gradient(to bottom, rgba(5, 102, 94, 0.8), rgba(4, 78, 71, 0.95))' }}>
        <Toaster position="top-right" richColors />

        <div className="w-full max-w-3xl bg-white shadow-3xl border border-gray-200 rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-center text-[#096B68] mb-8"
                style={{ fontFamily: "'Nunito', sans-serif" }}>Create Account</h2>

            <form onSubmit={handleSignUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Enter Your Name"
                    />
                    {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Username <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Create New Username"
                    />
                    {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Enter Your Valid Email"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        onBlur={(e) => validateField('gender', e.target.value)}
                        className="w-full p-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Enter Your Mobile Number"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Alternate Phone
                    </label>
                    <Input
                        type="tel"
                        name="altPhone"
                        value={formData.altPhone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        placeholder="Optional Mobile Number"
                    />
                    {errors.altPhone && <p className="text-sm text-red-500 mt-1">{errors.altPhone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Branch Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Enter Branch Name"
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Create New Password"
                    />
                    <span
                        className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#219C90]"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                    </span>
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="relative">
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 border-teal-600"
                        required
                        placeholder="Repeat Your Password"
                    />
                    <span
                        className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#219C90]"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {/* {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                    </span>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <Button
                        type="submit"
                        className="w-full text-white font-medium py-2 rounded-lg transition duration-300"
                    >
                        Sign Up
                    </Button>

                    <div className="text-center text-md mt-4">
                        Already have an account?{' '}
                        <button type="button" className="text-[#219C90] hover:underline" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
}

export default SignUp;