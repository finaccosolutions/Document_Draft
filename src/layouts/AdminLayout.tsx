import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, FileText, LayoutGrid, Settings, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user is admin, redirect if not
  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600';
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary-600" />
                <span className="font-bold text-xl text-primary-800">DocGen</span>
              </Link>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <LayoutGrid className="mr-3 h-6 w-6" />
                  Templates
                </Link>
                <Link
                  to="/admin/categories"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/admin/categories')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Settings className="mr-3 h-6 w-6" />
                  Categories
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
              <Link to="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary-600" />
                <span className="font-bold text-xl text-primary-800">DocGen</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin')}`}
                >
                  <LayoutGrid className="mr-3 h-5 w-5" />
                  Templates
                </Link>
                <Link
                  to="/admin/categories"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/categories')}`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Categories
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <div className="flex items-center">
                  <span className="hidden md:inline-block text-sm text-gray-700 mr-2">
                    {user?.name}
                  </span>
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={handleLogout}
                  >
                    <span className="sr-only">Log out</span>
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;