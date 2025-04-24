import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';

interface FieldProps {
  id: string;
  label: string;
  type: string;
  required: boolean;
  fields?: FieldProps[];
}

interface DocumentFormProps {
  fields: FieldProps[];
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ fields, onSubmit, defaultValues = {} }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });

  const renderField = (field: FieldProps, nestIndex?: number, fieldArrayName?: string) => {
    const fieldId = nestIndex !== undefined ? `${fieldArrayName}.${nestIndex}.${field.id}` : field.id;
    const fieldName = nestIndex !== undefined ? `${fieldArrayName}[${nestIndex}].${field.id}` : field.id;
    const errorKey = nestIndex !== undefined ? `${fieldArrayName}[${nestIndex}].${field.id}` : field.id;
    
    let component;

    switch (field.type) {
      case 'text':
        component = (
          <Controller
            control={control}
            name={fieldName}
            rules={{ required: field.required ? 'This field is required' : false }}
            render={({ field: { onChange, value } }) => (
              <input
                id={fieldId}
                type="text"
                className="input"
                onChange={onChange}
                value={value || ''}
              />
            )}
          />
        );
        break;
      case 'textarea':
        component = (
          <Controller
            control={control}
            name={fieldName}
            rules={{ required: field.required ? 'This field is required' : false }}
            render={({ field: { onChange, value } }) => (
              <textarea
                id={fieldId}
                className="input min-h-[100px]"
                onChange={onChange}
                value={value || ''}
              />
            )}
          />
        );
        break;
      case 'number':
        component = (
          <Controller
            control={control}
            name={fieldName}
            rules={{ required: field.required ? 'This field is required' : false }}
            render={({ field: { onChange, value } }) => (
              <input
                id={fieldId}
                type="number"
                className="input"
                onChange={onChange}
                value={value || ''}
              />
            )}
          />
        );
        break;
      case 'date':
        component = (
          <Controller
            control={control}
            name={fieldName}
            rules={{ required: field.required ? 'This field is required' : false }}
            render={({ field: { onChange, value } }) => (
              <input
                id={fieldId}
                type="date"
                className="input"
                onChange={onChange}
                value={value || ''}
              />
            )}
          />
        );
        break;
      case 'repeater':
        component = <RepeaterField field={field} control={control} errors={errors} />;
        break;
      default:
        component = <p>Unsupported field type: {field.type}</p>;
    }

    if (field.type === 'repeater') {
      return component;
    }

    const error = errors[errorKey];

    return (
      <div className="mb-4" key={fieldId}>
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-error-500">*</span>}
        </label>
        {component}
        {error && <p className="mt-1 text-sm text-error-500">{error.message as string}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => renderField(field))}
      <button type="submit" className="btn-primary w-full mt-6">
        Generate Document
      </button>
    </form>
  );
};

interface RepeaterFieldProps {
  field: FieldProps;
  control: any;
  errors: any;
}

const RepeaterField: React.FC<RepeaterFieldProps> = ({ field, control, errors }) => {
  const { fields: repeaterFields, append, remove } = useFieldArray({
    control,
    name: field.id,
  });

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label} {field.required && <span className="text-error-500">*</span>}
        </label>
        <button
          type="button"
          className="flex items-center text-sm text-primary-600 hover:text-primary-800"
          onClick={() => {
            const newItem = field.fields?.reduce((acc, f) => {
              acc[f.id] = '';
              return acc;
            }, {} as any);
            append(newItem);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </button>
      </div>

      {repeaterFields.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500 text-sm">
          No items added. Click 'Add Item' to get started.
        </div>
      )}

      {repeaterFields.map((item, index) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded-md mb-3">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Item {index + 1}</h4>
            <button
              type="button"
              className="text-gray-500 hover:text-error-500"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {field.fields?.map((nestedField) => (
            <div key={`${item.id}-${nestedField.id}`} className="mb-3">
              {renderNestedField(nestedField, index, field.id, control, errors)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const renderNestedField = (field: FieldProps, index: number, fieldArrayName: string, control: any, errors: any) => {
  const fieldId = `${fieldArrayName}.${index}.${field.id}`;
  const fieldName = `${fieldArrayName}[${index}].${field.id}`;
  
  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label} {field.required && <span className="text-error-500">*</span>}
      </label>
      <Controller
        control={control}
        name={fieldName}
        rules={{ required: field.required ? 'This field is required' : false }}
        render={({ field: { onChange, value } }) => {
          switch (field.type) {
            case 'textarea':
              return (
                <textarea
                  id={fieldId}
                  className="input min-h-[80px]"
                  onChange={onChange}
                  value={value || ''}
                />
              );
            case 'number':
              return (
                <input
                  id={fieldId}
                  type="number"
                  className="input"
                  onChange={onChange}
                  value={value || ''}
                />
              );
            default:
              return (
                <input
                  id={fieldId}
                  type="text"
                  className="input"
                  onChange={onChange}
                  value={value || ''}
                />
              );
          }
        }}
      />
      {errors[fieldArrayName]?.[index]?.[field.id] && (
        <p className="mt-1 text-sm text-error-500">
          {errors[fieldArrayName][index][field.id].message}
        </p>
      )}
    </div>
  );
};

export default DocumentForm;