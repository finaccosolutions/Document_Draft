import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, FileText, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  
  const handleLogout = () => {
    logout();
    navigate('/');
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
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/documents" className={`${textClass} hover:text-blue-600 transition-colors duration-200`}>
              Templates
            </Link>
            <Link to="/#how-it-works" className={`${textClass} hover:text-blue-600 transition-colors duration-200`}>
              How It Works
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`${textClass} hover:text-blue-600 transition-colors duration-200`}>
                Admin
              </Link>
            )}
            {user ? (
              <div className="relative group">
                <button className={`flex items-center ${textClass} hover:text-blue-600 transition-colors duration-200`}>
                  <span>{user.name}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className={`${textClass} hover:text-blue-600 transition-colors duration-200`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
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
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3 py-3">
              <Link 
                to="/documents" 
                className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Templates
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block w-fit"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;