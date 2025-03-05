import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface AISuggestionsProps {
  original: string;
  enhanced: string;
  onApply: (text: string) => void;
  onClose: () => void;
}

const AISuggestions = ({ original, enhanced, onApply, onClose }: AISuggestionsProps) => {
  const [selectedText, setSelectedText] = useState<'original' | 'enhanced'>('enhanced');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">AI Enhanced Content</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className={`p-4 border rounded-md ${
                selectedText === 'original' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedText('original')}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Original Text</h4>
                {selectedText === 'original' && (
                  <span className="bg-blue-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </span>
                )}
              </div>
              <p className="text-gray-600 whitespace-pre-line">{original}</p>
            </div>
            
            <div 
              className={`p-4 border rounded-md ${
                selectedText === 'enhanced' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedText('enhanced')}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">AI Enhanced</h4>
                {selectedText === 'enhanced' && (
                  <span className="bg-blue-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </span>
                )}
              </div>
              <p className="text-gray-600 whitespace-pre-line">{enhanced}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-2">AI Improvements</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Enhanced professional language</li>
              <li>Improved clarity and conciseness</li>
              <li>Optimized for CV impact</li>
              <li>Added action verbs and quantifiable achievements</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(selectedText === 'original' ? original : enhanced)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Selected Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
