import { 
  LayoutDashboard, HandCoins, CreditCard, Building, 
  FileText, Users, BarChart, ChevronLeft, ChevronRight,
  LogOut, FileUser
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Sidebar({ isOpen, toggleSidebar }) {
  // Get current location to highlight active route
  const location = useLocation();
  
  // State for logout confirmation modal
  const [logoutConfirmation, setLogoutConfirmation] = useState({
    isOpen: false
  });

  const mainNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Add Customer', icon: <Users size={20} />, path: '/add-customer' },
    { name: 'Create Saving', icon: <HandCoins size={20} />, path: '/create-saving' },
    { name: 'Create RD', icon: <CreditCard size={20} />, path: '/create-rd' },
    { name: 'Create FD', icon: <Building size={20} />, path: '/create-fd' },
    { name: 'Apply for Loan', icon: <FileText size={20} />, path: '/apply-loan' },
    { name: 'All Customers', icon: <FileUser size={20} />, path: '/all-customers' },
    { name: 'Reports', icon: <BarChart size={20} />, path: '/reports' },
  ];
  
  // Handlers for logout confirmation
  const handleLogoutClick = () => {
    setLogoutConfirmation({ isOpen: true });
  };
  
  const handleCancelLogout = () => {
    setLogoutConfirmation({ isOpen: false });
  };

  return (
    <aside 
      className={`bg-white shadow-lg transition-all duration-300 flex flex-col border-r border-gray-200 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center">
            <img 
                src="/src/assets/ojal-logo.png" 
                alt="Ojal micro Finance" 
                className="h-[70px] w-[75px] ml-12"/>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center w-full p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-gray-100 border border-teal-400 text-teal-600 '
                    : 'hover:bg-gray-100 '
                }`}
              >
                <span className="text-gray-500">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogoutClick}
          className={`flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 w-full ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
      
      {/* logout Confirmation notify Modal */}
      {logoutConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center overlay">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 slide-in">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm LogOut
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <Link to="/login">
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 bounce-effect">
                  Yes
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;