import React, { useState } from 'react';
import { categories } from '../../data/templateData';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

const CategoryPage: React.FC = () => {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    // Check if category name already exists
    if (categoryList.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      setError('Category with this name already exists');
      return;
    }

    const id = newCategory.toLowerCase().replace(/\s+/g, '-');
    setCategoryList([...categoryList, { id, name: newCategory }]);
    setNewCategory('');
    setError('');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategoryList(categoryList.filter(cat => cat.id !== id));
    }
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleEditSave = (id: string) => {
    if (!editValue.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    // Check if new name conflicts with existing category
    if (categoryList.some(cat => cat.id !== id && cat.name.toLowerCase() === editValue.toLowerCase())) {
      setError('Category with this name already exists');
      return;
    }

    setCategoryList(
      categoryList.map(cat => (cat.id === id ? { ...cat, name: editValue } : cat))
    );
    setEditingId(null);
    setError('');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Category Management</h1>
        <p className="text-gray-600">
          Manage categories for organizing document templates
        </p>
      </div>

      {/* Add new category */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex">
          <input
            type="text"
            className="input rounded-r-none flex-grow"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn-primary rounded-l-none"
            onClick={handleAddCategory}
          >
            <Plus className="h-5 w-5 mr-1" /> Add Category
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {categoryList.length > 0 ? (
            categoryList.map((category) => (
              <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                {editingId === category.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="input flex-grow mr-2"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-success-500 hover:text-success-700"
                        onClick={() => handleEditSave(category.id)}
                        title="Save"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={handleEditCancel}
                        title="Cancel"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <div className="flex space-x-3">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleEditStart(category)}
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-error-500 hover:text-error-700"
                        onClick={() => handleDeleteCategory(category.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="px-6 py-10 text-center text-gray-500">
              No categories found. Add a new category to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoryPage;