import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, FolderPlus, Settings, Users, 
  ChevronRight, ChevronDown, Menu, X 
} from 'lucide-react';
import Button from '../../components/ui/Button';

import TemplateManager from './TemplateManager';
import TemplateEditor from './TemplateEditor';
import CategoryManager from './CategoryManager';
import UserManager from './UserManager';
import AdminDashboard from './AdminDashboard';

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Navigation items for the sidebar
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Templates', href: '/admin/templates', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderPlus },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
  
  // Check if the current path matches or includes the nav item path
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex flex-shrink-0 items-center px-4">
            <Link to="/" className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">DocuGen</span>
            </Link>
          </div>
          
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="px-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/" className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold">DocuGen</span>
              </Link>
            </div>
            
            <nav className="mt-5 flex-1 space-y-1 bg-white px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Navbar */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/">
                <Button variant="outline" size="sm">
                  Exit Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-8">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/admin" className="hover:text-gray-700">
                  Admin
                </Link>
              </li>
              {location.pathname !== '/admin' && (
                <>
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li>
                    {location.pathname.includes('/admin/templates') && (
                      <Link to="/admin/templates" className="hover:text-gray-700">
                        Templates
                      </Link>
                    )}
                    {location.pathname.includes('/admin/categories') && (
                      <Link to="/admin/categories" className="hover:text-gray-700">
                        Categories
                      </Link>
                    )}
                    {location.pathname.includes('/admin/users') && (
                      <Link to="/admin/users" className="hover:text-gray-700">
                        Users
                      </Link>
                    )}
                    {location.pathname.includes('/admin/settings') && (
                      <Link to="/admin/settings" className="hover:text-gray-700">
                        Settings
                      </Link>
                    )}
                  </li>
                </>
              )}
              {location.pathname.includes('/edit') && (
                <>
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li>
                    <span className="text-gray-700">Edit</span>
                  </li>
                </>
              )}
              {location.pathname.includes('/create') && (
                <>
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li>
                    <span className="text-gray-700">Create</span>
                  </li>
                </>
              )}
            </ol>
          </nav>
          
          {/* Routes for the admin panel */}
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="templates" element={<TemplateManager />} />
            <Route path="templates/edit/:id" element={<TemplateEditor />} />
            <Route path="templates/create" element={<TemplateEditor />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;