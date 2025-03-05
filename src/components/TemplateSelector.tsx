import React from 'react';
import { Check } from 'lucide-react';

export type CVTemplate = 'modern' | 'academic' | 'minimal' | 'professional' | 'academic-professional';

interface TemplateSelectorProps {
  selectedTemplate: CVTemplate;
  onChange: (template: CVTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onChange }) => {
  const templates: Array<{
    id: CVTemplate;
    name: string;
    description: string;
    color: string;
  }> = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design with balanced whitespace',
      color: 'bg-blue-500'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Formal layout optimized for academic and research positions',
      color: 'bg-emerald-500'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Elegant simplicity with focus on content over design',
      color: 'bg-gray-700'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Traditional format with clear section hierarchy',
      color: 'bg-indigo-600'
    },
    {
      id: 'academic-professional',
      name: 'Academic Professional',
      description: 'Structured academic format with bullet points and clear sections',
      color: 'bg-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onChange(template.id)}
          className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
            selectedTemplate === template.id
              ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-30'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`h-3 ${template.color}`}></div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              {selectedTemplate === template.id && (
                <span className="bg-blue-500 text-white p-1 rounded-full">
                  <Check size={12} />
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">{template.description}</p>
            
            {/* Template preview */}
            <div className="mt-3 border border-gray-200 rounded">
              <div className={`h-1.5 ${template.color}`}></div>
              <div className="p-2">
                {template.id === 'academic-professional' ? (
                  <>
                    <div className="h-1.5 w-24 bg-gray-300 rounded mb-2 mx-auto"></div>
                    <div className="h-1 w-32 bg-gray-200 rounded mb-2 mx-auto"></div>
                    <div className="flex justify-center gap-1 mb-2">
                      <div className="h-1 w-3 bg-gray-100 rounded"></div>
                      <div className="h-1 w-3 bg-gray-100 rounded"></div>
                      <div className="h-1 w-3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-1.5 w-12 bg-gray-200 rounded mt-2 mb-1.5"></div>
                    <div className="pl-2">
                      <div className="flex items-start mb-1">
                        <div className="h-1 w-1 bg-gray-300 rounded-full mt-0.5 mr-1"></div>
                        <div className="h-1 w-full bg-gray-100 rounded"></div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-1 w-1 bg-gray-300 rounded-full mt-0.5 mr-1"></div>
                        <div className="h-1 w-11/12 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-1.5 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-100 rounded"></div>
                      <div className="h-1 w-full bg-gray-100 rounded"></div>
                      <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                    </div>
                    
                    <div className="h-1.5 w-12 bg-gray-200 rounded mt-3 mb-1.5"></div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-100 rounded"></div>
                      <div className="h-1 w-5/6 bg-gray-100 rounded"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
