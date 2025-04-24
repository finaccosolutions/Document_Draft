import React from 'react';
import { FileText, Download, Save } from 'lucide-react';

interface DocumentPreviewProps {
  html: string;
  data: any;
  onDownloadPdf: () => void;
  onDownloadWord: () => void;
  onSave: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  html,
  data,
  onDownloadPdf,
  onDownloadWord,
  onSave,
}) => {
  // Parse the HTML template and replace placeholders
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
    // This is a simplified implementation - a real one would use a proper template engine
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

  const processedHtml = processTemplate(html, data);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-card flex flex-col h-full">
      <div className="bg-gray-50 py-3 px-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="font-medium">Document Preview</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            className="btn-secondary py-1 px-3 text-xs flex items-center"
          >
            <Save className="h-3 w-3 mr-1" /> Save Draft
          </button>
          <button
            onClick={onDownloadPdf}
            className="btn-primary py-1 px-3 text-xs flex items-center"
          >
            <Download className="h-3 w-3 mr-1" /> PDF
          </button>
          <button
            onClick={onDownloadWord}
            className="btn-accent py-1 px-3 text-xs flex items-center"
          >
            <Download className="h-3 w-3 mr-1" /> Word
          </button>
        </div>
      </div>
      <div className="p-6 overflow-auto flex-grow bg-white">
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </div>
  );
};

export default DocumentPreview;