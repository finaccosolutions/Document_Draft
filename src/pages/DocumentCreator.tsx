import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Save, File, Download, Eye, CheckCircle, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../context/ToastContext';

// Mock template data
const templates = {
  1: {
    id: 1,
    name: 'Basic Employment Contract',
    description: 'A standard employment contract template for full-time employees.',
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
  },
  // Additional templates would be defined here
};

const DocumentCreator: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState<boolean[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get template
  const template = templateId ? templates[parseInt(templateId) as keyof typeof templates] : null;
  
  // Initialize form validation state
  useEffect(() => {
    if (template) {
      setIsValid(template.sections.map(() => false));
    }
  }, [template]);

  if (!template) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h2>
          <p className="text-gray-600 mb-6">The template you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/documents')}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (sectionId: string, fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value,
      },
    }));
  };
  
  const validateSection = (sectionIndex: number) => {
    const section = template.sections[sectionIndex];
    const sectionData = formData[section.id] || {};
    let sectionValid = true;
    
    for (const field of section.fields) {
      if (field.required) {
        const value = sectionData[field.id];
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          sectionValid = false;
          break;
        }
      }
    }
    
    const newIsValid = [...isValid];
    newIsValid[sectionIndex] = sectionValid;
    setIsValid(newIsValid);
    
    return sectionValid;
  };
  
  const handleNext = () => {
    if (validateSection(currentStep)) {
      if (currentStep < template.sections.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowPreview(true);
      }
    } else {
      showToast('Please fill in all required fields before continuing', 'error');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/documents');
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast('Document saved successfully', 'success');
    setIsSaving(false);
  };
  
  const handleGenerate = async (format: 'pdf' | 'word' | 'html') => {
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast(`Document generated in ${format.toUpperCase()} format`, 'success');
  };
  
  // Render form fields for the current section
  const renderField = (field: any, sectionId: string) => {
    const sectionData = formData[sectionId] || {};
    const value = sectionData[field.id] !== undefined ? sectionData[field.id] : field.defaultValue;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.id}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(sectionId, field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.id}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(sectionId, field.id, e.target.value)}
            required={field.required}
            rows={3}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={value || ''}
            onChange={(e) => handleInputChange(sectionId, field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={value || ''}
            onChange={(e) => handleInputChange(sectionId, field.id, e.target.value)}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="mt-1 flex items-center">
            <input
              type="checkbox"
              id={field.id}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={value || field.defaultChecked || false}
              onChange={(e) => handleInputChange(sectionId, field.id, e.target.checked)}
            />
            <label htmlFor={field.id} className="ml-2 block text-gray-700">
              {field.checkboxLabel || "Yes"}
            </label>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                isLoading={isSaving}
                icon={<Save className="h-4 w-4" />}
              >
                Save Draft
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                icon={<Eye className="h-4 w-4" />}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </div>
          
          {/* Progress steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {template.sections.map((section, index) => (
                <div key={section.id} className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                      index < currentStep 
                        ? 'bg-blue-600 text-white' 
                        : index === currentStep 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-600' 
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className="hidden md:block mt-2 text-xs text-gray-500">{section.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 hidden md:block">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-100">
                <div
                  style={{ width: `${(currentStep / (template.sections.length - 1)) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {template.sections[currentStep].title}
              </h2>
              
              <form>
                {template.sections[currentStep].fields.map((field) => (
                  <div key={field.id} className="mb-4">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field, template.sections[currentStep].id)}
                  </div>
                ))}
              </form>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  icon={<ChevronLeft className="h-4 w-4" />}
                >
                  {currentStep === 0 ? 'Back to Templates' : 'Previous'}
                </Button>
                <Button
                  onClick={handleNext}
                  icon={currentStep === template.sections.length - 1 ? <Eye className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                >
                  {currentStep === template.sections.length - 1 ? 'Preview Document' : 'Next'}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Preview */}
          {showPreview && (
            <div className="lg:w-1/2">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Document Preview</h2>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerate('pdf')}
                      icon={<File className="h-4 w-4" />}
                    >
                      PDF
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerate('word')}
                      icon={<File className="h-4 w-4" />}
                    >
                      Word
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-6 bg-white">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">EMPLOYMENT AGREEMENT</h1>
                  </div>
                  
                  <p className="mb-4">
                    This Employment Agreement (the "Agreement") is made and entered into as of{' '}
                    <span className="font-semibold underline">
                      {formData.terms?.startDate || '_________________'}
                    </span>, by and between{' '}
                    <span className="font-semibold underline">
                      {formData.company?.companyName || '_________________'}
                    </span>
                    (the "Company"), located at{' '}
                    <span className="font-semibold underline">
                      {formData.company?.companyAddress || '_________________'}
                    </span>
                    and{' '}
                    <span className="font-semibold underline">
                      {formData.employee?.employeeName || '_________________'}
                    </span>
                    (the "Employee"), located at{' '}
                    <span className="font-semibold underline">
                      {formData.employee?.employeeAddress || '_________________'}
                    </span>.
                  </p>
                  
                  <h2 className="text-lg font-bold mb-2">1. POSITION AND DUTIES</h2>
                  <p className="mb-4">
                    The Company agrees to employ the Employee as a{' '}
                    <span className="font-semibold underline">
                      {formData.terms?.position || '_________________'}
                    </span>. The Employee shall perform all duties and responsibilities inherent in the position, which may be reasonably assigned by the Company.
                  </p>
                  
                  <h2 className="text-lg font-bold mb-2">2. TERM</h2>
                  <p className="mb-4">
                    The Employee's employment under this Agreement shall commence on{' '}
                    <span className="font-semibold underline">
                      {formData.terms?.startDate || '_________________'}
                    </span>
                    and shall continue until terminated pursuant to the provisions of this Agreement.
                  </p>
                  
                  <h2 className="text-lg font-bold mb-2">3. COMPENSATION</h2>
                  <p className="mb-4">
                    The Employee shall receive an annual salary of ${' '}
                    <span className="font-semibold underline">
                      {formData.terms?.salary || '_____'}
                    </span>, payable on a{' '}
                    <span className="font-semibold underline">
                      {formData.terms?.paySchedule === 'weekly' 
                        ? 'weekly' 
                        : formData.terms?.paySchedule === 'biweekly' 
                          ? 'bi-weekly' 
                          : formData.terms?.paySchedule === 'monthly' 
                            ? 'monthly' 
                            : '_________'}
                    </span>{' '}
                    basis.
                  </p>
                  
                  <h2 className="text-lg font-bold mb-2">4. BENEFITS</h2>
                  <p className="mb-4">
                    The Employee shall be entitled to the following benefits:
                  </p>
                  <ul className="list-disc pl-8 mb-4">
                    {formData.benefits?.healthInsurance && (
                      <li className="mb-1">Health Insurance</li>
                    )}
                    {formData.benefits?.dentalInsurance && (
                      <li className="mb-1">Dental Insurance</li>
                    )}
                    {formData.benefits?.retirement401k && (
                      <li className="mb-1">401(k) Retirement Plan</li>
                    )}
                    {formData.benefits?.paidTimeOff && (
                      <li className="mb-1">
                        {formData.benefits.paidTimeOff} days of Paid Time Off per year
                      </li>
                    )}
                  </ul>
                  
                  <h2 className="text-lg font-bold mb-2">5. SIGNATURES</h2>
                  <div className="flex justify-between mt-8">
                    <div>
                      <div className="border-t border-black pt-1 w-48">
                        <p className="text-sm">Company Representative Signature</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-black pt-1 w-48">
                        <p className="text-sm">Employee Signature</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <div>
                      <div className="border-t border-black pt-1 w-48">
                        <p className="text-sm">Date</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-black pt-1 w-48">
                        <p className="text-sm">Date</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => handleGenerate('pdf')}
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download Document
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCreator;