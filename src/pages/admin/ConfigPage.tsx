import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Trash2, Save, Eye } from 'lucide-react';
import { templates, categories } from '../../data/templateData';

const ConfigPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const isNewTemplate = templateId === 'new';

  // Template state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fields, setFields] = useState<any[]>([]);
  const [html, setHtml] = useState('');
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});

  useEffect(() => {
    if (!isNewTemplate) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setName(template.name);
        setDescription(template.description);
        setCategoryId(template.categoryId);
        setFields(template.fields);
        setHtml(template.html);
        
        // Generate sample data for preview
        const sampleData = template.fields.reduce((acc: any, field: any) => {
          if (field.type === 'repeater') {
            acc[field.id] = [
              field.fields.reduce((item: any, subField: any) => {
                item[subField.id] = `Sample ${subField.label}`;
                return item;
              }, {})
            ];
          } else {
            acc[field.id] = `Sample ${field.label}`;
          }
          return acc;
        }, {});
        
        setPreviewData(sampleData);
      } else {
        navigate('/admin');
      }
    } else {
      // Set defaults for new template
      setName('');
      setDescription('');
      setCategoryId('');
      setFields([]);
      setHtml('<h1>Template Title</h1>\n<p>Template content with {{placeholders}}.</p>');
    }
  }, [templateId, navigate, isNewTemplate]);

  const handleSave = () => {
    // Validation
    if (!name) {
      alert('Template name is required');
      return;
    }
    
    if (!categoryId) {
      alert('Category is required');
      return;
    }
    
    if (fields.length === 0) {
      alert('At least one field is required');
      return;
    }
    
    // In a real application, this would save to a database
    console.log('Saving template:', {
      id: isNewTemplate ? name.toLowerCase().replace(/\s+/g, '-') : templateId,
      name,
      description,
      categoryId,
      fields,
      html
    });
    
    // Redirect back to template list
    navigate('/admin');
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        id: `field_${fields.length + 1}`,
        label: '',
        type: 'text',
        required: false
      }
    ]);
  };

  const updateField = (index: number, field: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = field;
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addRepeaterField = (repeaterIndex: number) => {
    const currentField = fields[repeaterIndex];
    if (currentField.type === 'repeater') {
      const updatedFields = [...fields];
      updatedFields[repeaterIndex] = {
        ...currentField,
        fields: [
          ...(currentField.fields || []),
          {
            id: `subfield_${currentField.fields?.length + 1 || 1}`,
            label: '',
            type: 'text'
          }
        ]
      };
      setFields(updatedFields);
    }
  };

  const updateRepeaterField = (repeaterIndex: number, fieldIndex: number, field: any) => {
    const currentField = fields[repeaterIndex];
    if (currentField.type === 'repeater') {
      const updatedFields = [...fields];
      const updatedRepeaterFields = [...currentField.fields];
      updatedRepeaterFields[fieldIndex] = field;
      
      updatedFields[repeaterIndex] = {
        ...currentField,
        fields: updatedRepeaterFields
      };
      
      setFields(updatedFields);
    }
  };

  const removeRepeaterField = (repeaterIndex: number, fieldIndex: number) => {
    const currentField = fields[repeaterIndex];
    if (currentField.type === 'repeater') {
      const updatedFields = [...fields];
      updatedFields[repeaterIndex] = {
        ...currentField,
        fields: currentField.fields.filter((_, i) => i !== fieldIndex)
      };
      setFields(updatedFields);
    }
  };

  // Process HTML for preview
  const processTemplate = (template: string, data: any): string => {
    let processedHtml = template;

    // Replace simple placeholders {{field}}
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedHtml = processedHtml.replace(regex, data[key]);
      }
    });

    // Handle repeater fields with each blocks
    const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    processedHtml = processedHtml.replace(eachRegex, (match, repeaterField, content) => {
      if (Array.isArray(data[repeaterField])) {
        return data[repeaterField]
          .map((item: any) => {
            let itemContent = content;
            Object.keys(item).forEach(key => {
              const regex = new RegExp(`{{${key}}}`, 'g');
              itemContent = itemContent.replace(regex, item[key]);
            });
            return itemContent;
          })
          .join('');
      }
      return '';
    });

    return processedHtml;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {isNewTemplate ? 'Create New Template' : 'Edit Template'}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary flex items-center"
          >
            <Eye className="h-5 w-5 mr-2" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template configuration */}
        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Template Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name <span className="text-error-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-error-500">*</span>
                </label>
                <select
                  id="category"
                  className="input"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="input min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Form fields */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Form Fields</h2>
              <button
                className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                onClick={addField}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Field
              </button>
            </div>
            
            {fields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No fields defined. Click 'Add Field' to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Field #{index + 1}</h3>
                      <button
                        className="text-error-500 hover:text-error-700"
                        onClick={() => removeField(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field ID
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={field.id}
                          onChange={(e) => updateField(index, { ...field, id: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={field.label}
                          onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          className="input"
                          value={field.type}
                          onChange={(e) => updateField(index, { ...field, type: e.target.value })}
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="repeater">Repeater (List)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={field.required}
                          onChange={(e) => updateField(index, { ...field, required: e.target.checked })}
                        />
                        <label htmlFor={`required-${index}`} className="ml-2 block text-sm text-gray-700">
                          Required
                        </label>
                      </div>
                    </div>
                    
                    {field.type === 'repeater' && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium">Repeater Fields</h4>
                          <button
                            className="text-primary-600 hover:text-primary-800 flex items-center text-xs"
                            onClick={() => addRepeaterField(index)}
                          >
                            <PlusCircle className="h-3 w-3 mr-1" /> Add Sub-field
                          </button>
                        </div>
                        
                        {field.fields?.length > 0 ? (
                          <div className="space-y-3">
                            {field.fields.map((subField: any, subIndex: number) => (
                              <div key={subIndex} className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-xs font-medium">Sub-field #{subIndex + 1}</h5>
                                  <button
                                    className="text-error-500 hover:text-error-700"
                                    onClick={() => removeRepeaterField(index, subIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      ID
                                    </label>
                                    <input
                                      type="text"
                                      className="input text-sm"
                                      value={subField.id}
                                      onChange={(e) => updateRepeaterField(
                                        index,
                                        subIndex,
                                        { ...subField, id: e.target.value }
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Label
                                    </label>
                                    <input
                                      type="text"
                                      className="input text-sm"
                                      value={subField.label}
                                      onChange={(e) => updateRepeaterField(
                                        index,
                                        subIndex,
                                        { ...subField, label: e.target.value }
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Type
                                    </label>
                                    <select
                                      className="input text-sm"
                                      value={subField.type}
                                      onChange={(e) => updateRepeaterField(
                                        index,
                                        subIndex,
                                        { ...subField, type: e.target.value }
                                      )}
                                    >
                                      <option value="text">Text</option>
                                      <option value="textarea">Textarea</option>
                                      <option value="number">Number</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 bg-gray-50 rounded-md">
                            <p className="text-gray-500 text-xs">No repeater fields. Click 'Add Sub-field' to add.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* HTML Editor / Preview */}
        <div className="space-y-6">
          {!showPreview ? (
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-lg font-semibold mb-4">HTML Template</h2>
              <p className="text-sm text-gray-600 mb-4">
                Use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{field_id}}'}</code> to insert field values. 
                For repeater fields, use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{#each repeater_id}}...{{/each}}'}</code>.
              </p>
              
              <textarea
                className="input font-mono text-sm min-h-[500px]"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
              ></textarea>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Edit HTML
                </button>
              </div>
              
              <div className="p-6 overflow-auto" style={{ maxHeight: '600px' }}>
                <div 
                  className="prose max-w-full"
                  dangerouslySetInnerHTML={{ __html: processTemplate(html, previewData) }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;