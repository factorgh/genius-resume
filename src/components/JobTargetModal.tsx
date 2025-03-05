import { useState } from 'react';
import { GraduationCap, School, X } from 'lucide-react';
import { AITargetSchool } from './AIEnhancer';

interface SchoolTargetModalProps {
  onClose: () => void;
  onSave: (schoolDetails: AITargetSchool) => void;
  currentTarget?: AITargetSchool;
}

const SchoolTargetModal = ({ onClose, onSave, currentTarget }: SchoolTargetModalProps) => {
  const [schoolName, setSchoolName] = useState(currentTarget?.name || '');
  const [program, setProgram] = useState(currentTarget?.program || '');
  const [requirements, setRequirements] = useState(currentTarget?.requirements || '');

  const handleSave = () => {
    onSave({
      name: schoolName,
      program,
      requirements
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <School size={18} className="mr-2 text-blue-600" />
            Target School/Program
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Enter details about the school and program you're targeting. The AI will use this information to tailor your CV content for academic applications.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800 text-sm flex items-start mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>
                For the most accurate recommendations, paste the full program requirements from the school's website.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                School/University Name
              </label>
              <div className="flex">
                <div className="bg-gray-100 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-md">
                  <School size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Harvard University, MIT, Stanford"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Program/Degree
              </label>
              <div className="flex">
                <div className="bg-gray-100 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-md">
                  <GraduationCap size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. Master of Science in Computer Science, PhD in Biology"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Program Requirements
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={8}
                placeholder="Paste the program requirements, admission criteria, and any specific qualifications needed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
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
            onClick={handleSave}
            disabled={!program.trim()}
            className={`px-4 py-2 rounded-md ${
              !program.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Save Target Program
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolTargetModal;
