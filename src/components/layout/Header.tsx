import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, FileText, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const headerClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled || !isHomePage ? 'bg-white shadow-md' : 'bg-transparent'
  }`;
  
  const textClass = scrolled || !isHomePage ? 'text-gray-800' : 'text-white';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <FileText className={`h-8 w-8 ${textClass}`} />
              <span className={`ml-2 text-xl font-bold ${textClass}`}>DocuGen</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/documents" 
              className={`${textClass} hover:text-blue-600 transition-colors duration-200 font-medium`}
            >
              Templates
            </Link>
            <Link 
              to="/#how-it-works" 
              className={`${textClass} hover:text-blue-600 transition-colors duration-200 font-medium`}
            >
              How It Works
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`${textClass} hover:text-blue-600 transition-colors duration-200 font-medium`}
              >
                Admin
              </Link>
            )}
            
            <div className="relative">
              <button
                className={`flex items-center ${textClass} hover:text-blue-600 transition-colors duration-200 font-medium focus:outline-none`}
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <span>Account</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                  showAccountMenu ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                }`}
                onMouseLeave={() => setShowAccountMenu(false)}
              >
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <div className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <div className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign in
                      </div>
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <div className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign up
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`${textClass} hover:text-blue-600 transition-colors duration-200`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>
        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="p-6">
            <Link 
              to="/" 
              className="flex items-center mb-8"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">DocuGen</span>
            </Link>
            
            <nav className="space-y-4">
              <Link
                to="/documents"
                className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/#how-it-works"
                className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;