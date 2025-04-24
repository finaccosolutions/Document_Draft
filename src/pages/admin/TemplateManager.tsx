import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Edit, Trash2, PlusCircle, 
  Search, Filter, ChevronDown, X, Eye, Copy
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

// Mock data for templates
const mockTemplates = [
  { 
    id: 1, 
    name: 'Basic Employment Contract', 
    category: 'HR Templates',
    categoryId: 3,
    description: 'A standard employment contract template for full-time employees.',
    lastUpdated: '2025-04-10',
    createdBy: 'Admin User',
    status: 'published',
  },
  { 
    id: 2, 
    name: 'Non-Disclosure Agreement', 
    category: 'Legal Documents',
    categoryId: 1,
    description: 'Protect your confidential information with this comprehensive NDA template.',
    lastUpdated: '2025-04-08',
    createdBy: 'Admin User',
    status: 'published',
  },
  { 
    id: 3, 
    name: 'Consulting Agreement', 
    category: 'Business Contracts',
    categoryId: 2,
    description: 'A detailed agreement for consulting services and project deliverables.',
    lastUpdated: '2025-04-05',
    createdBy: 'Admin User',
    status: 'published',
  },
  { 
    id: 4, 
    name: 'Service Level Agreement', 
    category: 'Business Contracts',
    categoryId: 2,
    description: 'Define service expectations and performance metrics with this SLA template.',
    lastUpdated: '2025-04-03',
    createdBy: 'Admin User',
    status: 'draft',
  },
  { 
    id: 5, 
    name: 'Rental Agreement', 
    category: 'Legal Documents',
    categoryId: 1,
    description: 'A comprehensive rental agreement for residential property leasing.',
    lastUpdated: '2025-04-01',
    createdBy: 'Admin User',
    status: 'published',
  },
];

const TemplateManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [templates, setTemplates] = useState(mockTemplates);
  const { showToast } = useToast();

  // Filter templates based on search, category, and status
  const filteredTemplates = templates.filter(template => {
    // Filter by search term
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === null || template.categoryId === selectedCategory;
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      setTemplates(templates.filter(template => template.id !== id));
      showToast('Template deleted successfully', 'success');
    }
  };

  const handleDuplicateTemplate = (id: number) => {
    const templateToDuplicate = templates.find(template => template.id === id);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: `${templateToDuplicate.name} (Copy)`,
        status: 'draft' as const,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setTemplates([...templates, newTemplate]);
      showToast('Template duplicated successfully', 'success');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Template Manager</h2>
        <Link to="/admin/templates/create">
          <Button icon={<PlusCircle className="h-4 w-4" />}>
            Create Template
          </Button>
        </Link>
      </div>
      
      {/* Filters and Search */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
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
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                    <div className="space-y-1">
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === null ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        All Categories
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === 1 ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCategory(1)}
                      >
                        Legal Documents
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === 2 ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCategory(2)}
                      >
                        Business Contracts
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === 3 ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCategory(3)}
                      >
                        HR Templates
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
                        All Statuses
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          statusFilter === 'published' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setStatusFilter('published')}
                      >
                        Published
                      </button>
                      <button
                        className={`w-full text-left px-2 py-1 text-sm rounded ${
                          statusFilter === 'draft' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setStatusFilter('draft')}
                      >
                        Draft
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
                        setSelectedCategory(null);
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
      
      {/* Templates Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{template.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {template.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {/* View template */}}
                          title="View Template"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <Link 
                          to={`/admin/templates/edit/${template.id}`} 
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Template"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleDuplicateTemplate(template.id)}
                          title="Duplicate Template"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteTemplate(template.id)}
                          title="Delete Template"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No templates found matching your filters.
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

export default TemplateManager;