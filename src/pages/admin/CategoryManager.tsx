import React, { useState } from 'react';
import { 
  FolderPlus, Edit, Trash2, Save, X, Plus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

// Mock data for categories
const initialCategories = [
  { id: 1, name: 'Legal Documents', count: 24, description: 'Legal contracts, agreements, and forms.' },
  { id: 2, name: 'Business Contracts', count: 18, description: 'Contracts for business relationships and transactions.' },
  { id: 3, name: 'HR Templates', count: 15, description: 'Human resources documents and employee forms.' },
  { id: 4, name: 'Financial Forms', count: 12, description: 'Financial documentation and reporting templates.' },
  { id: 5, name: 'Personal Documents', count: 9, description: 'Documents for personal use and individual agreements.' },
  { id: 6, name: 'Education Templates', count: 7, description: 'Forms and documents for educational purposes.' },
];

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const { showToast } = useToast();

  const handleSaveCategory = (id: number) => {
    if (!categoryForm.name.trim()) {
      showToast('Category name cannot be empty', 'error');
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === id ? { ...category, name: categoryForm.name, description: categoryForm.description } : category
    ));
    
    setEditingCategoryId(null);
    showToast('Category updated successfully', 'success');
  };
  
  const handleCreateCategory = () => {
    if (!categoryForm.name.trim()) {
      showToast('Category name cannot be empty', 'error');
      return;
    }
    
    const newCategory = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: categoryForm.name,
      description: categoryForm.description,
      count: 0,
    };
    
    setCategories([...categories, newCategory]);
    setCategoryForm({ name: '', description: '' });
    setIsCreating(false);
    showToast('Category created successfully', 'success');
  };
  
  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? All templates in this category will be unassigned.')) {
      setCategories(categories.filter(category => category.id !== id));
      showToast('Category deleted successfully', 'success');
    }
  };
  
  const handleEditClick = (category: any) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name, description: category.description });
  };
  
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setCategoryForm({ name: '', description: '' });
  };
  
  const handleCancelCreate = () => {
    setIsCreating(false);
    setCategoryForm({ name: '', description: '' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Category Manager</h2>
        <Button 
          onClick={() => setIsCreating(true)} 
          disabled={isCreating}
          icon={<Plus className="h-4 w-4" />}
        >
          Create Category
        </Button>
      </div>
      
      {isCreating && (
        <Card className="mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancelCreate}
                icon={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCategory}
                icon={<Save className="h-4 w-4" />}
              >
                Create Category
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Templates
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center">
                        <FolderPlus className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingCategoryId === category.id ? (
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        rows={2}
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{category.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.count} templates
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleSaveCategory(category.id)}
                          title="Save Changes"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditClick(category)}
                          title="Edit Category"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteCategory(category.id)}
                          title="Delete Category"
                          disabled={category.count > 0}
                        >
                          <Trash2 className={`h-5 w-5 ${category.count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found.
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

export default CategoryManager;