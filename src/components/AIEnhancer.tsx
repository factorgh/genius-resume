import { useState } from 'react';
import { Check, Lightbulb, X, Zap } from 'lucide-react';
import { AIService, AISuggestionRequest, AISuggestionResponse } from '../services/AIService';
import DiffViewer from './DiffViewer';

export interface AITargetSchool {
  name?: string;
  program?: string;
  requirements?: string;
}

interface AIEnhancerProps {
  title: string;
  fieldKey: string;
  originalContent: string;
  onApply: (text: string) => void;
  onClose: () => void;
  targetSchool?: AITargetSchool;
  userBackground?: string;
}

const AIEnhancer = ({ 
  title, 
  fieldKey, 
  originalContent, 
  onApply, 
  onClose, 
  targetSchool,
  userBackground 
}: AIEnhancerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AISuggestionResponse | null>(null);
  const [selectedText, setSelectedText] = useState<'original' | 'enhanced'>('enhanced');
  const [enhancementType, setEnhancementType] = useState<'improve' | 'grammar' | 'bullets' | 'keywords'>('improve');
  const [showDiff, setShowDiff] = useState(false);

  const processWithAI = async (type: 'improve' | 'grammar' | 'bullets' | 'keywords') => {
    setIsProcessing(true);
    setEnhancementType(type);
    
    try {
      const request: AISuggestionRequest = {
        field: fieldKey,
        content: originalContent,
        context: {
          programRequirements: targetSchool?.requirements,
          targetProgram: targetSchool?.program,
          userBackground
        }
      };
      
      const response = await AIService.enhanceContent(request);
      setAiResponse(response);
      setSelectedText('enhanced');
    } catch (error) {
      console.error("AI processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (aiResponse) {
      onApply(selectedText === 'original' ? originalContent : aiResponse.enhanced);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {!aiResponse ? (
          <div className="p-6 flex-1">
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Original Content</h4>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-line border border-gray-200">
                {originalContent || <span className="text-gray-400 italic">No content provided</span>}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Choose Enhancement Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => processWithAI('improve')}
                  disabled={isProcessing}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-blue-100 p-2 rounded-full">
                      <Zap size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Overall Improvement</h5>
                      <p className="text-sm text-gray-600">Enhance content with academic language and better phrasing</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => processWithAI('grammar')}
                  disabled={isProcessing}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-left"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-green-100 p-2 rounded-full">
                      <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Grammar & Clarity</h5>
                      <p className="text-sm text-gray-600">Fix grammar issues and improve clarity</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => processWithAI('bullets')}
                  disabled={isProcessing}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-left"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-purple-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Bullet Point Format</h5>
                      <p className="text-sm text-gray-600">Convert to impactful bullet points with academic achievements</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => processWithAI('keywords')}
                  disabled={isProcessing || !targetSchool?.requirements}
                  className={`p-4 border border-gray-200 rounded-lg transition-colors text-left ${
                    targetSchool?.requirements 
                      ? 'hover:bg-amber-50 hover:border-amber-200' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 bg-amber-100 p-2 rounded-full">
                      <Lightbulb size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Program Requirements Match</h5>
                      <p className="text-sm text-gray-600">
                        {targetSchool?.requirements 
                          ? 'Optimize for the target program requirements' 
                          : 'Requires program requirements'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              
              {isProcessing && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Enhancing content...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowDiff(!showDiff)}
                className={`px-3 py-1.5 text-sm rounded ${
                  showDiff ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showDiff ? "Hide Changes" : "Show Changes"}
              </button>
            </div>
            
            {showDiff ? (
              <div className="border rounded-md mb-6">
                <div className="p-3 bg-gray-50 border-b">
                  <h4 className="font-medium text-gray-700">Detailed Changes</h4>
                </div>
                <div className="p-4">
                  <DiffViewer original={originalContent} enhanced={aiResponse.enhanced} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div 
                  className={`p-4 border rounded-md cursor-pointer ${
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
                  <div className="text-gray-600 whitespace-pre-line">
                    {originalContent || <span className="text-gray-400 italic">No original content</span>}
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-md cursor-pointer ${
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
                  <div className="text-gray-600 whitespace-pre-line">{aiResponse.enhanced}</div>
                </div>
              </div>
            )}
            
            {aiResponse.explanation && (
              <div className="mt-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-2">AI Improvements</h4>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded text-blue-700 text-sm">
                  {aiResponse.explanation}
                </div>
              </div>
            )}
            
            {enhancementType === 'bullets' && aiResponse.bulletPoints && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Individual Bullet Points</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {aiResponse.bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-6">
              <h4 className="font-medium text-green-800 text-sm mb-1">Key Changes Made</h4>
              <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                <li>Enhanced academic language and terminology</li>
                <li>Improved sentence structure and clarity</li>
                <li>Added stronger action verbs for impact</li>
                <li>Adjusted formatting for better readability</li>
                {targetSchool?.program && 
                  <li>Optimized content for {targetSchool.program} requirements</li>
                }
              </ul>
            </div>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          {aiResponse && (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply {selectedText === 'original' ? 'Original' : 'Enhanced'} Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEnhancer;
