import React, { useState } from 'react';
import { 
  Search, Filter, ChevronDown, X, Edit, Trash2, 
  UserPlus, Mail, CheckCircle, Users 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

// Mock data for users
const initialUsers = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@example.com', 
    role: 'admin',
    status: 'active',
    joinDate: '2025-01-15',
    lastLogin: '2025-04-12',
    documentsCreated: 28,
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'michael.chen@example.com', 
    role: 'user',
    status: 'active',
    joinDate: '2025-02-03',
    lastLogin: '2025-04-11',
    documentsCreated: 15,
  },
  { 
    id: 3, 
    name: 'Emily Rodriguez', 
    email: 'emily.rodriguez@example.com', 
    role: 'user',
    status: 'active',
    joinDate: '2025-02-18',
    lastLogin: '2025-04-10',
    documentsCreated: 22,
  },
  { 
    id: 4, 
    name: 'David Smith', 
    email: 'david.smith@example.com', 
    role: 'user',
    status: 'inactive',
    joinDate: '2025-03-01',
    lastLogin: '2025-03-15',
    documentsCreated: 5,
  },
  { 
    id: 5, 
    name: 'Jessica Brown', 
    email: 'jessica.brown@example.com', 
    role: 'user',
    status: 'active',
    joinDate: '2025-03-10',
    lastLogin: '2025-04-09',
    documentsCreated: 10,
  },
];

const UserManager: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'user'>('user');
  
  const { showToast } = useToast();

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Filter by search term
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== id));
      showToast('User deleted successfully', 'success');
    }
  };
  
  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    
    const user = users.find(u => u.id === id);
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    showToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };
  
  const handleChangeUserRole = (id: number, newRole: 'admin' | 'user') => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
    
    showToast(`User role updated to ${newRole}`, 'success');
  };
  
  const handleSendInvite = () => {
    if (!inviteEmail || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // In a real app, this would send an invitation email
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
    setInviteEmail('');
    setInviteRole('user');
    setIsInviting(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Manager</h2>
        <Button 
          onClick={() => setIsInviting(!isInviting)} 
          icon={<UserPlus className="h-4 w-4" />}
        >
          Invite User
        </Button>
      </div>
      
      {isInviting && (
        <Card className="mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New User</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                User Role
              </label>
              <select
                id="role"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'admin' | 'user')}
              >
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsInviting(false)}
                icon={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendInvite}
                icon={<Mail className="h-4 w-4" />}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Filters and Search */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="h-4 w-4" />}
              >
                Filters
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Role</h3>
                    <div className="space-y-1">
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          roleFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setRoleFilter('all')}
                      >
                        All Roles
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          roleFilter === 'admin' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setRoleFilter('admin')}
                      >
                        Administrators
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          roleFilter === 'user' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setRoleFilter('user')}
                      >
                        Regular Users
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                    <div className="space-y-1">
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setStatusFilter('all')}
                      >
                        All Status
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          statusFilter === 'active' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setStatusFilter('active')}
                      >
                        Active
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          statusFilter === 'inactive' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setStatusFilter('inactive')}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('all');
                        setStatusFilter('all');
                        setShowFilters(false);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <span className="font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value as 'admin' | 'user')}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.documentsCreated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className={`${
                            user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.status === 'active' ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <CheckCircle className="h-5 w-5" />
                          )}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Users className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-sm font-medium text-gray-900">No users found</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        No users match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManager;