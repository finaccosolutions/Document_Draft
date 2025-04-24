import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock data
import { templates, categories } from '../data/templateData';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Templates</h1>
          <p className="text-gray-600">Browse and select from our collection of professional templates</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="md:hidden btn-secondary flex items-center"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                    !selectedCategory ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Templates
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                      selectedCategory === category.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile filters dialog */}
          {filtersOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 md:hidden">
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <div className="bg-white rounded-lg w-full max-w-md">
                    <div className="flex justify-between items-center p-4 border-b">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-3">Categories</h4>
                      <div className="space-y-2">
                        <button
                          className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                            !selectedCategory ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedCategory(null);
                            setFiltersOpen(false);
                          }}
                        >
                          All Templates
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                              selectedCategory === category.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setFiltersOpen(false);
                            }}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t p-4">
                      <button
                        className="btn-primary w-full"
                        onClick={() => setFiltersOpen(false)}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates grid */}
          <div className="flex-grow">
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="card overflow-hidden">
                    <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
                      <FileText className="h-20 w-20 text-gray-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                      {/* Category tag */}
                      <div className="flex items-center mb-4">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {categories.find(c => c.id === template.categoryId)?.name}
                        </span>
                      </div>
                      <Link
                        to={isAuthenticated ? `/creator/${template.id}` : "/auth/login"}
                        className="btn-primary w-full"
                      >
                        {isAuthenticated ? "Use Template" : "Sign In to Use"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                <p className="text-gray-600">
                  We couldn't find any templates matching your criteria. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;