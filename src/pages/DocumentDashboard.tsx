import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, X, ChevronDown, FileText, Filter, Star, Clock, PlusCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Mock data for templates
const mockTemplates = [
  { 
    id: 1, 
    name: 'Basic Employment Contract', 
    category: 'HR Templates',
    categoryId: 3,
    description: 'A standard employment contract template for full-time employees.',
    lastUpdated: '2025-04-10',
    popular: true,
    featured: true,
  },
  { 
    id: 2, 
    name: 'Non-Disclosure Agreement', 
    category: 'Legal Documents',
    categoryId: 1,
    description: 'Protect your confidential information with this comprehensive NDA template.',
    lastUpdated: '2025-04-08',
    popular: true,
    featured: false,
  },
  { 
    id: 3, 
    name: 'Consulting Agreement', 
    category: 'Business Contracts',
    categoryId: 2,
    description: 'A detailed agreement for consulting services and project deliverables.',
    lastUpdated: '2025-04-05',
    popular: false,
    featured: true,
  },
  { 
    id: 4, 
    name: 'Service Level Agreement', 
    category: 'Business Contracts',
    categoryId: 2,
    description: 'Define service expectations and performance metrics with this SLA template.',
    lastUpdated: '2025-04-03',
    popular: false,
    featured: false,
  },
  { 
    id: 5, 
    name: 'Rental Agreement', 
    category: 'Legal Documents',
    categoryId: 1,
    description: 'A comprehensive rental agreement for residential property leasing.',
    lastUpdated: '2025-04-01',
    popular: true,
    featured: false,
  },
  { 
    id: 6, 
    name: 'Invoice Template', 
    category: 'Financial Forms',
    categoryId: 4,
    description: 'A professional invoice template for billing clients and tracking payments.',
    lastUpdated: '2025-03-29',
    popular: true,
    featured: false,
  },
  { 
    id: 7, 
    name: 'Project Proposal', 
    category: 'Business Contracts',
    categoryId: 2,
    description: 'Present your project ideas in a structured, professional format.',
    lastUpdated: '2025-03-26',
    popular: false,
    featured: true,
  },
  { 
    id: 8, 
    name: 'Termination Letter', 
    category: 'HR Templates',
    categoryId: 3,
    description: 'A formal template for employment termination documentation.',
    lastUpdated: '2025-03-23',
    popular: false,
    featured: false,
  },
];

// Mock data for categories
const mockCategories = [
  { id: 1, name: 'Legal Documents', count: 24 },
  { id: 2, name: 'Business Contracts', count: 18 },
  { id: 3, name: 'HR Templates', count: 15 },
  { id: 4, name: 'Financial Forms', count: 12 },
  { id: 5, name: 'Personal Documents', count: 9 },
  { id: 6, name: 'Education Templates', count: 7 },
];

const DocumentDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryId = queryParams.get('category') 
    ? parseInt(queryParams.get('category') as string) 
    : null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'recent'>('all');
  const [templates, setTemplates] = useState(mockTemplates);

  // Filter templates based on search, category, and filter type
  useEffect(() => {
    let filtered = [...mockTemplates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(template => template.categoryId === selectedCategory);
    }

    // Filter by type
    if (filterType === 'popular') {
      filtered = filtered.filter(template => template.popular);
    } else if (filterType === 'recent') {
      filtered = filtered.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      ).slice(0, 5);
    }

    setTemplates(filtered);
  }, [searchTerm, selectedCategory, filterType]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    
    // Update URL without reloading the page
    if (categoryId) {
      navigate(`/documents?category=${categoryId}`);
    } else {
      navigate('/documents');
    }
  };

  const handleCreateDocument = (templateId: number) => {
    if (user) {
      navigate(`/documents/create/${templateId}`);
    } else {
      showToast('Please sign in to create a document', 'info');
      navigate('/login', { state: { from: `/documents/create/${templateId}` } });
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory === null
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCategoryChange(null)}
                  >
                    All Templates
                  </button>
                </li>
                {mockCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategory 
                    ? mockCategories.find(c => c.id === selectedCategory)?.name 
                    : 'All Templates'}
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    {searchTerm && (
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Filter Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilter(!showFilter)}
                      className="w-full sm:w-auto"
                      icon={<Filter className="h-4 w-4" />}
                    >
                      Filter {filterType !== 'all' && `(${filterType})`}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                    
                    {showFilter && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              filterType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setFilterType('all');
                              setShowFilter(false);
                            }}
                          >
                            All Templates
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              filterType === 'popular' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setFilterType('popular');
                              setShowFilter(false);
                            }}
                          >
                            <div className="flex items-center">
                              <Star className="mr-2 h-4 w-4" />
                              Popular Templates
                            </div>
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              filterType === 'recent' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setFilterType('recent');
                              setShowFilter(false);
                            }}
                          >
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Recently Updated
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Templates Grid */}
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} hover className="h-full flex flex-col">
                    <div className="p-6 flex flex-col h-full">
                      {template.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-3">
                          Featured
                        </span>
                      )}
                      <div className="flex items-start mb-4">
                        <FileText className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{template.description}</p>
                      <div className="mt-auto">
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">{template.category}</span>
                          <span className="ml-auto text-xs">Updated: {template.lastUpdated}</span>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleCreateDocument(template.id)}
                          icon={<PlusCircle className="h-4 w-4" />}
                        >
                          Create Document
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mb-4">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any templates matching your search criteria.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setFilterType('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDashboard;