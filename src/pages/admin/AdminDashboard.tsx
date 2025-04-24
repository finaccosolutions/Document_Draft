import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Users, FolderPlus, BarChart2, 
  TrendingUp, TrendingDown, Download, ArrowRight 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  // Mock data for admin dashboard
  const stats = [
    { name: 'Total Templates', value: '42', icon: FileText, change: '+12%', trend: 'up' },
    { name: 'Active Users', value: '876', icon: Users, change: '+18%', trend: 'up' },
    { name: 'Documents Generated', value: '2,453', icon: Download, change: '+24%', trend: 'up' },
    { name: 'Categories', value: '8', icon: FolderPlus, change: '-', trend: 'neutral' },
  ];
  
  const popularTemplates = [
    { id: 1, name: 'Non-Disclosure Agreement', category: 'Legal Documents', downloads: 342 },
    { id: 2, name: 'Basic Employment Contract', category: 'HR Templates', downloads: 289 },
    { id: 3, name: 'Invoice Template', category: 'Financial Forms', downloads: 256 },
    { id: 4, name: 'Service Agreement', category: 'Business Contracts', downloads: 214 },
    { id: 5, name: 'Rental Agreement', category: 'Legal Documents', downloads: 189 },
  ];
  
  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', joined: '2025-04-12' },
    { id: 2, name: 'Michael Chen', email: 'michael.chen@example.com', joined: '2025-04-11' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com', joined: '2025-04-10' },
    { id: 4, name: 'David Smith', email: 'david.smith@example.com', joined: '2025-04-09' },
    { id: 5, name: 'Jessica Brown', email: 'jessica.brown@example.com', joined: '2025-04-08' },
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.trend === 'up' && (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
              )}
              {stat.trend === 'down' && (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1.5" />
              )}
              {stat.trend === 'neutral' && (
                <div className="h-4 w-4 mr-1.5"></div>
              )}
              <span className={`font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 
                'text-gray-500'
              }`}>
                {stat.change} from last month
              </span>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Templates */}
        <Card className="overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Popular Templates</h3>
              <Link to="/admin/templates">
                <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                  View All
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.downloads.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Recent Users */}
        <Card className="overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
              <Link to="/admin/users">
                <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                  View All
                </Button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Activity Chart Placeholder */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Generation Activity</h3>
        <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Activity chart visualization would appear here</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;