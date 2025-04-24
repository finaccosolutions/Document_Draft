import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { templates, categories } from '../data/templateData';
import DocumentForm from '../components/DocumentForm';
import DocumentPreview from '../components/DocumentPreview';

// Mock PDF and Word generation functions
import { generatePDF, generateWord } from '../utils/documentUtils';

const CreatorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [template, setTemplate] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Steps in the document creation process
  const steps = [
    { name: 'Template Information', description: 'Review template details' },
    { name: 'Fill Information', description: 'Enter your document details' },
    { name: 'Preview & Download', description: 'Review and export your document' },
  ];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    // Find template data
    const templateData = templates.find(t => t.id === templateId);
    if (templateData) {
      setTemplate(templateData);
      const categoryData = categories.find(c => c.id === templateData.categoryId);
      setCategory(categoryData);
      
      // Initialize form data with empty values
      const initialData = templateData.fields.reduce((acc: any, field: any) => {
        if (field.type === 'repeater') {
          acc[field.id] = [];
        } else {
          acc[field.id] = '';
        }
        return acc;
      }, {});
      
      setFormData(initialData);
    } else {
      // Template not found
      navigate('/dashboard');
    }
  }, [templateId, isAuthenticated, navigate]);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setCurrentStep(2); // Go to preview step
    setShowPreview(true);
  };

  const handleSaveDraft = () => {
    // In a real application, this would save the draft to a database
    alert('Draft saved successfully!');
  };

  const handleDownloadPdf = async () => {
    if (template && formData) {
      try {
        await generatePDF(template.html, formData, `${template.name}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const handleDownloadWord = async () => {
    if (template && formData) {
      try {
        await generateWord(template.html, formData, `${template.name}.docx`);
      } catch (error) {
        console.error('Error generating Word document:', error);
        alert('Failed to generate Word document. Please try again.');
      }
    }
  };

  if (!template || !category) {
    return (
      <div className="container-custom mx-auto py-8">
        <div className="text-center py-16">
          <div className="animate-pulse w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Loading template...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto py-8">
      {/* Steps progress indicator */}
      <nav className="mb-8">
        <ol className="flex items-center">
          {steps.map((step, index) => (
            <li 
              key={index} 
              className={`flex items-center ${
                index !== steps.length - 1 ? 'w-full' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= index 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span 
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= index ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {index !== steps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > index ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-card p-6">
        {currentStep === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
              <div className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                {category.name}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{template.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">What You'll Need</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {template.fields.map((field: any) => (
                  <li key={field.id}>
                    {field.label} {field.required && <span className="text-error-500">*</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-center">
              <button
                className="btn-primary"
                onClick={() => setCurrentStep(1)}
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-6">{template.name}</h1>
              <DocumentForm 
                fields={template.fields} 
                onSubmit={handleFormSubmit} 
                defaultValues={formData}
              />
              
              <div className="flex justify-between mt-4">
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentStep(0)}
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Back
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleSaveDraft}
                >
                  <Save className="mr-2 h-5 w-5" /> Save Draft
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-primary-100 text-primary-700 rounded-full text-xs flex items-center justify-center mr-2 mt-1">✓</span>
                  <span>Fill in all required fields marked with an asterisk (*).</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-primary-100 text-primary-700 rounded-full text-xs flex items-center justify-center mr-2 mt-1">✓</span>
                  <span>For repeatable sections, click 'Add Item' to add multiple entries.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-primary-100 text-primary-700 rounded-full text-xs flex items-center justify-center mr-2 mt-1">✓</span>
                  <span>Preview your document before downloading to ensure all information is correct.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{template.name} - Preview</h1>
              <div className="flex space-x-2">
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Edit Information
                </button>
              </div>
            </div>
            
            <div className="flex-grow min-h-[600px]">
              <DocumentPreview
                html={template.html}
                data={formData}
                onDownloadPdf={handleDownloadPdf}
                onDownloadWord={handleDownloadWord}
                onSave={handleSaveDraft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorPage;