import './Navbar.css';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', id: 'dashboard', path: '/' },
    { name: 'Daily collection', id: 'savings', path: '/daily-collection' },
    { name: 'Recurring Deposit', id: 'rd', path: '/create-rd' },
    { name: 'Fixed Deposit', id: 'fd', path: '/create-fd' },
    { name: 'Loan', id: 'loan', path: '/apply-loan' },
  ];
  
  const getInitials = (name) => {
    if (!name || name === "NA") return "NA";
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase();
    }
    // For single word names, take first two characters if available
    return name.substring(0, 2).toUpperCase();
  };

  const userName = user?.fullName || "NA";
  const branchName = user?.branchName || "NA";
  const userRole = user?.role || "NA";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-sm p-3 border-b border-t-gray-300 flex justify-between items-center nav-container">
      {/* Left section: Menu button & nav items */}
      <div className="flex items-center space-x-4"> 
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex space-x-4 desktop-nav nav-items">
          {navItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path}
              className={`px-3 py-2 rounded nav-link hover:bg-gray-100 ${location.pathname === item.path ? 'text-teal-600 font-sm' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Right section: Profile */}
      <div className="flex items-center space-x-4 profile-section">
        {/* Profile dropdown */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="hidden md:block profile-details">
              <div className="font-medium">Name : {userName}</div>
              <div className="text-sm text-gray-500">Branch : <span className='text-gray-700 font-medium'>{branchName}</span></div>
              <div className="text-sm text-gray-500">Role :  <span className='text-teal-700 font-bold'>{userRole}</span></div>
            </div>
         
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white profile-avatar">
              {getInitials(userName)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-nav-active' : ''}`}>
        {navItems.map((item) => (
          <Link 
            key={item.id} 
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        {/* User info for mobile - shown in menu */}
        <div className="user-info-mobile mobile-nav-item">
          <div className="font-medium text-gray-800">{userName}</div>
          <div className="text-sm text-gray-500">Branch: {branchName}</div>
          <div className="text-sm text-teal-700 font-medium">Role: {userRole}</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;