import { jsPDF } from 'jspdf';
import htmlToDocx from 'html-to-docx';

// Mock PDF generation
export const generatePDF = async (
  html: string,
  data: any,
  filename: string
): Promise<void> => {
  try {
    // Process the HTML template with the data
    const processedHtml = processTemplate(html, data);
    
    // Initialize jsPDF
    const doc = new jsPDF();
    
    // This is a simplified version - in a real app, we would use proper HTML to PDF rendering
    // For now, we'll just add some text to demonstrate
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

  // Handle custom helpers like multiply
  const helperRegex = /{{multiply\s+(\w+)\s+(\w+)}}/g;
  processedHtml = processedHtml.replace(helperRegex, (match, arg1, arg2) => {
    const val1 = parseFloat(data[arg1]) || 0;
    const val2 = parseFloat(data[arg2]) || 0;
    return (val1 * val2).toFixed(2);
  });

  // Calculate subtotal, tax, total for invoices
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