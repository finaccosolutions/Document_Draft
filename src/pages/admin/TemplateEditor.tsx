import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Plus, Trash2, ArrowLeft, Code, Eye, 
  CheckCircle, MoveVertical, ArrowUpDown, Edit 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';

// Mock template data
const mockTemplate = {
  id: 1,
  name: 'Basic Employment Contract',
  description: 'A standard employment contract template for full-time employees.',
  categoryId: 3,
  status: 'published',
  content: `<h1>EMPLOYMENT AGREEMENT</h1>
<p>This Employment Agreement (the "Agreement") is made and entered into as of {{terms.startDate}}, by and between {{company.companyName}} (the "Company"), located at {{company.companyAddress}} and {{employee.employeeName}} (the "Employee"), located at {{employee.employeeAddress}}.</p>
<h2>1. POSITION AND DUTIES</h2>
<p>The Company agrees to employ the Employee as a {{terms.position}}. The Employee shall perform all duties and responsibilities inherent in the position, which may be reasonably assigned by the Company.</p>
<h2>2. TERM</h2>
<p>The Employee's employment under this Agreement shall commence on {{terms.startDate}} and shall continue until terminated pursuant to the provisions of this Agreement.</p>
<h2>3. COMPENSATION</h2>
<p>The Employee shall receive an annual salary of {{terms.salary}}, payable on a {{terms.paySchedule}} basis.</p>
<h2>4. BENEFITS</h2>
<p>The Employee shall be entitled to the following benefits:</p>
<ul>
  {{#if benefits.healthInsurance}}<li>Health Insurance</li>{{/if}}
  {{#if benefits.dentalInsurance}}<li>Dental Insurance</li>{{/if}}
  {{#if benefits.retirement401k}}<li>401(k) Retirement Plan</li>{{/if}}
  {{#if benefits.paidTimeOff}}<li>{{benefits.paidTimeOff}} days of Paid Time Off per year</li>{{/if}}
</ul>`,
  sections: [
    {
      id: 'company',
      title: 'Company Information',
      fields: [
        { id: 'companyName', label: 'Company Name', type: 'text', required: true, placeholder: 'ABC Corporation' },
        { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true, placeholder: '123 Business St, City, State ZIP' },
        { id: 'companyPhone', label: 'Company Phone', type: 'text', required: true, placeholder: '(555) 123-4567' },
      ],
    },
    {
      id: 'employee',
      title: 'Employee Information',
      fields: [
        { id: 'employeeName', label: 'Employee Name', type: 'text', required: true, placeholder: 'John Doe' },
        { id: 'employeeAddress', label: 'Employee Address', type: 'textarea', required: true, placeholder: '456 Residence Ave, City, State ZIP' },
        { id: 'employeePhone', label: 'Employee Phone', type: 'text', required: true, placeholder: '(555) 987-6543' },
        { id: 'employeeEmail', label: 'Employee Email', type: 'email', required: true, placeholder: 'john.doe@example.com' },
      ],
    },
    {
      id: 'terms',
      title: 'Employment Terms',
      fields: [
        { id: 'position', label: 'Position Title', type: 'text', required: true, placeholder: 'Software Developer' },
        { id: 'startDate', label: 'Start Date', type: 'date', required: true },
        { id: 'salary', label: 'Annual Salary', type: 'number', required: true, placeholder: '75000' },
        { id: 'paySchedule', label: 'Pay Schedule', type: 'select', required: true, options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]},
        { id: 'isFullTime', label: 'Full-Time Position', type: 'checkbox', defaultChecked: true },
      ],
    },
    {
      id: 'benefits',
      title: 'Benefits',
      fields: [
        { id: 'healthInsurance', label: 'Health Insurance', type: 'checkbox', defaultChecked: true },
        { id: 'dentalInsurance', label: 'Dental Insurance', type: 'checkbox', defaultChecked: true },
        { id: 'retirement401k', label: '401(k) Plan', type: 'checkbox', defaultChecked: true },
        { id: 'paidTimeOff', label: 'Paid Time Off (days/year)', type: 'number', required: true, placeholder: '15' },
      ],
    },
  ],
};

// Mock categories data
const mockCategories = [
  { id: 1, name: 'Legal Documents' },
  { id: 2, name: 'Business Contracts' },
  { id: 3, name: 'HR Templates' },
  { id: 4, name: 'Financial Forms' },
  { id: 5, name: 'Personal Documents' },
  { id: 6, name: 'Education Templates' },
];

const TemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isNewTemplate = !id;
  
  const [template, setTemplate] = useState<any>(isNewTemplate ? {
    name: '',
    description: '',
    categoryId: '',
    status: 'draft',
    content: '',
    sections: [],
  } : { ...mockTemplate });
  
  const [activeTab, setActiveTab] = useState<'config' | 'content' | 'preview'>('config');
  const [sampleData, setSampleData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // For section being edited
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  
  // Generate sample data from sections
  useEffect(() => {
    const data: any = {};
    template.sections.forEach((section: any) => {
      data[section.id] = {};
      section.fields.forEach((field: any) => {
        switch (field.type) {
          case 'text':
          case 'textarea':
            data[section.id][field.id] = field.placeholder || `Sample ${field.label}`;
            break;
          case 'email':
            data[section.id][field.id] = field.placeholder || 'sample@example.com';
            break;
          case 'number':
            data[section.id][field.id] = field.placeholder || '100';
            break;
          case 'date':
            data[section.id][field.id] = new Date().toISOString().split('T')[0];
            break;
          case 'select':
            data[section.id][field.id] = field.options && field.options.length > 0 
              ? field.options[0].value 
              : '';
            break;
          case 'checkbox':
            data[section.id][field.id] = field.defaultChecked || false;
            break;
          default:
            data[section.id][field.id] = '';
        }
      });
    });
    setSampleData(data);
  }, [template.sections]);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast(`Template ${isNewTemplate ? 'created' : 'updated'} successfully`, 'success');
    setIsSaving(false);
    navigate('/admin/templates');
  };
  
  const handleAddSection = () => {
    const newSectionId = `section_${Date.now()}`;
    const newSection = {
      id: newSectionId,
      title: 'New Section',
      fields: [],
    };
    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
    });
    setEditingSectionId(newSectionId);
  };
  
  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section? All fields in this section will be deleted.')) {
      setTemplate({
        ...template,
        sections: template.sections.filter((section: any) => section.id !== sectionId),
      });
      if (editingSectionId === sectionId) {
        setEditingSectionId(null);
      }
    }
  };
  
  const handleAddField = (sectionId: string) => {
    const newFieldId = `field_${Date.now()}`;
    const newField = {
      id: newFieldId,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
    };
    
    setTemplate({
      ...template,
      sections: template.sections.map((section: any) => 
        section.id === sectionId 
          ? { ...section, fields: [...section.fields, newField] }
          : section
      ),
    });
    
    setEditingFieldId(newFieldId);
    setEditingSectionId(sectionId);
  };
  
  const handleDeleteField = (sectionId: string, fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      setTemplate({
        ...template,
        sections: template.sections.map((section: any) => 
          section.id === sectionId 
            ? { ...section, fields: section.fields.filter((field: any) => field.id !== fieldId) }
            : section
        ),
      });
      
      if (editingFieldId === fieldId) {
        setEditingFieldId(null);
      }
    }
  };
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = template.sections.findIndex((section: any) => section.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) || 
      (direction === 'down' && sectionIndex === template.sections.length - 1)
    ) {
      return;
    }
    
    const newSections = [...template.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    setTemplate({
      ...template,
      sections: newSections,
    });
  };
  
  const handleMoveField = (sectionId: string, fieldId: string, direction: 'up' | 'down') => {
    const sectionIndex = template.sections.findIndex((section: any) => section.id === sectionId);
    const fieldIndex = template.sections[sectionIndex].fields.findIndex((field: any) => field.id === fieldId);
    
    if (
      (direction === 'up' && fieldIndex === 0) || 
      (direction === 'down' && fieldIndex === template.sections[sectionIndex].fields.length - 1)
    ) {
      return;
    }
    
    const newSections = [...template.sections];
    const newFields = [...newSections[sectionIndex].fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
    
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      fields: newFields,
    };
    
    setTemplate({
      ...template,
      sections: newSections,
    });
  };
  
  // Render template preview
  const renderPreview = () => {
    // Simple placeholder replacement
    let previewContent = template.content;
    
    // Replace simple placeholders like {{field}}
    Object.keys(sampleData).forEach(sectionId => {
      Object.keys(sampleData[sectionId]).forEach(fieldId => {
        const value = sampleData[sectionId][fieldId];
        const placeholder = `{{${sectionId}.${fieldId}}}`;
        previewContent = previewContent.split(placeholder).join(value);
      });
    });
    
    // Handle conditionals like {{#if field}}content{{/if}}
    const conditionalRegex = /{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g;
    previewContent = previewContent.replace(conditionalRegex, (match, condition, content) => {
      const [sectionId, fieldId] = condition.split('.');
      const value = sampleData[sectionId]?.[fieldId];
      return value ? content : '';
    });
    
    return <div dangerouslySetInnerHTML={{ __html: previewContent }} />;
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isNewTemplate ? 'Create New Template' : 'Edit Template'}
        </h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/templates')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            isLoading={isSaving}
            icon={<Save className="h-4 w-4" />}
          >
            {isNewTemplate ? 'Create Template' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'config' ? 'border-blue-500 text-blue-600' : ''
            }`}
            onClick={() => setActiveTab('config')}
          >
            Configuration
          </button>
          <button
            className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content' ? 'border-blue-500 text-blue-600' : ''
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content Editor
          </button>
          <button
            className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview' ? 'border-blue-500 text-blue-600' : ''
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </nav>
      </div>
      
      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={template.categoryId}
                    onChange={(e) => setTemplate({ ...template, categoryId: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={template.status}
                    onChange={(e) => setTemplate({ ...template, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Sections and Fields */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Form Sections & Fields</h3>
              <Button 
                size="sm" 
                onClick={handleAddSection}
                icon={<Plus className="h-4 w-4" />}
              >
                Add Section
              </Button>
            </div>
            
            {template.sections.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new section.
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={handleAddSection}
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Add Section
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {template.sections.map((section: any, sectionIndex: number) => (
                  <div key={section.id} className="border border-gray-200 rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        <MoveVertical className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-sm font-medium text-gray-900">
                          {editingSectionId === section.id ? (
                            <input
                              type="text"
                              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={section.title}
                              onChange={(e) => setTemplate({
                                ...template,
                                sections: template.sections.map((s: any) => 
                                  s.id === section.id ? { ...s, title: e.target.value } : s
                                ),
                              })}
                              autoFocus
                            />
                          ) : (
                            <span>
                              Section {sectionIndex + 1}: {section.title}
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => handleMoveSection(section.id, 'up')}
                          disabled={sectionIndex === 0}
                          title="Move Up"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => handleMoveSection(section.id, 'down')}
                          disabled={sectionIndex === template.sections.length - 1}
                          title="Move Down"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                          title={editingSectionId === section.id ? "Done Editing" : "Edit Section"}
                        >
                          {editingSectionId === section.id ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Edit className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteSection(section.id)}
                          title="Delete Section"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Fields */}
                      <div className="space-y-4">
                        {section.fields.map((field: any, fieldIndex: number) => (
                          <div 
                            key={field.id} 
                            className="bg-white border border-gray-200 rounded-md p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-grow">
                                {editingFieldId === field.id ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Field Label
                                      </label>
                                      <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={field.label}
                                        onChange={(e) => {
                                          const newSections = [...template.sections];
                                          newSections[sectionIndex].fields[fieldIndex].label = e.target.value;
                                          setTemplate({ ...template, sections: newSections });
                                        }}
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Field ID
                                      </label>
                                      <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={field.id}
                                        onChange={(e) => {
                                          const newSections = [...template.sections];
                                          newSections[sectionIndex].fields[fieldIndex].id = e.target.value;
                                          setTemplate({ ...template, sections: newSections });
                                        }}
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Field Type
                                      </label>
                                      <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={field.type}
                                        onChange={(e) => {
                                          const newSections = [...template.sections];
                                          newSections[sectionIndex].fields[fieldIndex].type = e.target.value;
                                          setTemplate({ ...template, sections: newSections });
                                        }}
                                      >
                                        <option value="text">Text</option>
                                        <option value="textarea">Text Area</option>
                                        <option value="email">Email</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="select">Select</option>
                                        <option value="checkbox">Checkbox</option>
                                      </select>
                                    </div>
                                    
                                    {field.type === 'select' && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-500">
                                          Options (comma separated: value:label)
                                        </label>
                                        <input
                                          type="text"
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                          placeholder="weekly:Weekly, biweekly:Bi-weekly"
                                          value={field.options ? field.options.map((o: any) => `${o.value}:${o.label}`).join(', ') : ''}
                                          onChange={(e) => {
                                            const options = e.target.value
                                              .split(',')
                                              .map(opt => opt.trim())
                                              .filter(Boolean)
                                              .map(opt => {
                                                const [value, label] = opt.split(':').map(s => s.trim());
                                                return { 
                                                  value: value || '', 
                                                  label: label || value || '' 
                                                };
                                              });
                                            
                                            const newSections = [...template.sections];
                                            newSections[sectionIndex].fields[fieldIndex].options = options;
                                            setTemplate({ ...template, sections: newSections });
                                          }}
                                        />
                                      </div>
                                    )}
                                    
                                    <div>
                                      <label className="block text-xs font-medium text-gray-500">
                                        Placeholder
                                      </label>
                                      <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={field.placeholder || ''}
                                        onChange={(e) => {
                                          const newSections = [...template.sections];
                                          newSections[sectionIndex].fields[fieldIndex].placeholder = e.target.value;
                                          setTemplate({ ...template, sections: newSections });
                                        }}
                                      />
                                    </div>
                                    
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`required-${field.id}`}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={field.required || false}
                                        onChange={(e) => {
                                          const newSections = [...template.sections];
                                          newSections[sectionIndex].fields[fieldIndex].required = e.target.checked;
                                          setTemplate({ ...template, sections: newSections });
                                        }}
                                      />
                                      <label
                                        htmlFor={`required-${field.id}`}
                                        className="ml-2 block text-xs font-medium text-gray-500"
                                      >
                                        Required Field
                                      </label>
                                    </div>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-2"
                                      onClick={() => setEditingFieldId(null)}
                                    >
                                      Done
                                    </Button>
                                
                                  </div>
                                ) : (
                                  <div className="flex flex-col">
                                    <div className="flex items-center">
                                      <span className="font-medium text-gray-900">{field.label}</span>
                                      {field.required && (
                                        <span className="ml-1 text-red-500">*</span>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                      <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                                        {field.type}
                                      </span>
                                      <span className="mx-2">|</span>
                                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {`{{${section.id}.${field.id}}}`}
                                      </code>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  onClick={() => handleMoveField(section.id, field.id, 'up')}
                                  disabled={fieldIndex === 0}
                                  title="Move Up"
                                >
                                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  onClick={() => handleMoveField(section.id, field.id, 'down')}
                                  disabled={fieldIndex === section.fields.length - 1}
                                  title="Move Down"
                                >
                                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  onClick={() => setEditingFieldId(field.id)}
                                  title="Edit Field"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteField(section.id, field.id)}
                                  title="Delete Field"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAddField(section.id)}
                          icon={<Plus className="h-4 w-4" />}
                        >
                          Add Field
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
      
      {/* Content Editor Tab */}
      {activeTab === 'content' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">HTML Template Content</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Code className="h-4 w-4 mr-1" />
              Use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{sectionId.fieldId}}'}</code> for placeholders
            </div>
          </div>
          
          <div className="mb-4">
            <textarea
              className="w-full h-96 font-mono text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={template.content}
              onChange={(e) => setTemplate({ ...template, content: e.target.value })}
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Available Fields</h4>
            <div className="space-y-2">
              {template.sections.map((section: any) => (
                <div key={section.id}>
                  <h5 className="text-xs font-medium text-gray-700">{section.title}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
                    {section.fields.map((field: any) => (
                      <div 
                        key={field.id} 
                        className="bg-white text-xs p-1 border border-gray-200 rounded flex justify-between items-center cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                          // Copy to clipboard
                          navigator.clipboard.writeText(`{{${section.id}.${field.id}}}`);
                          showToast('Copied to clipboard!', 'success');
                        }}
                      >
                        <span className="truncate">{field.label}</span>
                        <code className="bg-gray-100 px-1 rounded ml-1 text-xs">
                          {`{{${section.id}.${field.id}}}`}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => window.open('', '_blank')}
            >
              Open in Full Screen
            </Button>
          </div>
          
          <div className="border p-8 bg-white rounded min-h-[600px]">
            {renderPreview()}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TemplateEditor;