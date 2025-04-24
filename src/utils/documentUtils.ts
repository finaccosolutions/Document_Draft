import { jsPDF } from 'jspdf';
import htmlToDocx from 'html-to-docx';

// Mock PDF generation
export const generatePDF = async (
  html: string,
  data: any,
  filename: string
): Promise<void> => {
  try {
    // Validate required fields
    if (html.includes('{{total_cost}}') && data.total_cost === undefined) {
      throw new Error('total_cost is required for this template');
    }

    // Process the HTML template with the data
    const processedHtml = processTemplate(html, data);
    
    // Initialize jsPDF
    const doc = new jsPDF();
    
    // Simplified PDF generation (replace with proper HTML rendering in production)
    doc.setFontSize(12);
    doc.text('PDF Document Generated', 10, 10);
    doc.text('(This is a simplified demo - actual implementation would render HTML)', 10, 20);
    
    // Save the PDF
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating PDF:', error);
    return Promise.reject(error);
  }
};

// Mock Word document generation
export const generateWord = async (
  html: string,
  data: any,
  filename: string
): Promise<void> => {
  try {
    // Validate required fields
    if (html.includes('{{total_cost}}') && data.total_cost === undefined)

      // With more comprehensive validation:
      const requiredFields = ['company_name', 'client_name']; // Add other required fields
      requiredFields.forEach(field => {
        if (html.includes(`{{${field}}}`) && data[field] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      });


    // Process the HTML template with the data
    const processedHtml = processTemplate(html, data);
    
    // Convert HTML to DOCX buffer
    const buffer = await htmlToDocx(processedHtml, {
      title: filename.replace('.docx', ''),
    });
    
    // Create a download link
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating Word document:', error);
    return Promise.reject(error);
  }
};

// Helper function to process the HTML template with data
const processTemplate = (template: string, data: any): string => {
  let processedHtml = template;

  // Set default values for required numeric fields
  const numericFields = [
    'total_cost',
    'subtotal',
    'tax_amount',
    'total',
    'salary',
    'budget',
    'unit_price',
    'amount',
    'quantity',
    'vacation_days',
    'tax_rate',
    'term_months'
  ];

  // Initialize missing numeric fields with 0
  numericFields.forEach(field => {
    if (data[field] === undefined && template.includes(`{{${field}}}`)) {
      data[field] = 0;
    }
  });

  // Process all numeric fields with proper formatting
  numericFields.forEach(field => {
    if (data[field] !== undefined) {
      const value = parseFloat(data[field]) || 0;
      const regex = new RegExp(`{{${field}}}`, 'g');
      processedHtml = processedHtml.replace(regex, value.toFixed(2));
    }
  });

  // Replace simple placeholders {{field}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== undefined && !numericFields.includes(key) && (typeof value === 'string' || typeof value === 'number')) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedHtml = processedHtml.replace(regex, value.toString());
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
            const value = item[key];
            if (value !== undefined) {
              if (numericFields.includes(key)) {
                const numericValue = parseFloat(value) || 0;
                const regex = new RegExp(`{{${key}}}`, 'g');
                itemContent = itemContent.replace(regex, numericValue.toFixed(2));
              } else {
                const regex = new RegExp(`{{${key}}}`, 'g');
                itemContent = itemContent.replace(regex, value.toString());
              }
            }
          });
          return itemContent;
        })
        .join('');
    }
    return '';
  });

  // Handle custom helpers like multiply
  const helperRegex = /{{multiply\s+(\w+)\s+(\w+)}}/g;
  processedHtml = processedHtml.replace(helperRegex, (match, arg1, arg2) => {
    const val1 = parseFloat(data[arg1]) || 0;
    const val2 = parseFloat(data[arg2]) || 0;
    return (val1 * val2).toFixed(2);
  });

  // Calculate subtotal, tax, total for invoices if line_items exist
  if (data.line_items && Array.isArray(data.line_items)) {
    const subtotal = data.line_items.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0);
    
    const taxRate = parseFloat(data.tax_rate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    processedHtml = processedHtml
      .replace(/{{subtotal}}/g, subtotal.toFixed(2))
      .replace(/{{tax_amount}}/g, taxAmount.toFixed(2))
      .replace(/{{total}}/g, total.toFixed(2));
  }

  return processedHtml;
};