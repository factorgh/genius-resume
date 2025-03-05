import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, GraduationCap, Info, X } from 'lucide-react';

interface CVSectionGuideProps {
  onClose: () => void;
  onNavigateToSection: (section: string) => void;
}

const CVSectionGuide = ({ onClose, onNavigateToSection }: CVSectionGuideProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavigate = (section: string) => {
    onNavigateToSection(section);
    onClose();
  };

  const sections = [
    {
      id: 'summary',
      title: 'Summary of Qualifications',
      description: 'This section should directly address the specific requirements of your target program.',
      content: (
        <>
          <p className="mb-2">
            Your summary should highlight your academic achievements, research experience, and specific qualifications 
            that align with the graduate program's requirements and focus areas.
          </p>
          <p className="mb-3">The ideal summary should:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Be concise (3-5 sentences)</li>
            <li>Highlight your highest academic credentials</li>
            <li>Mention specialized skills relevant to your field</li>
            <li>Reference key research experiences or publications</li>
            <li>Include keywords from the program description</li>
          </ul>
          <div className="mt-4 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Example:</p>
            <p className="text-sm italic text-amber-700 mt-1">
              "First Class Honors LLB graduate with a 3.5/4.0 GPA and extensive research experience in intellectual property law, 
              with a focus on AI-generated content. Demonstrated expertise in legal research through publications on regulatory 
              frameworks for emerging technologies and internships at leading organizations in the field."
            </p>
          </div>
        </>
      )
    },
    {
      id: 'technical',
      title: 'Technical Competencies',
      description: 'List specific skills, tools, methodologies, or technologies relevant to your field.',
      content: (
        <>
          <p className="mb-3">Include domain-specific competencies such as:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Research methodologies (quantitative/qualitative)</li>
            <li>Laboratory techniques</li>
            <li>Specialized software or tools (SPSS, R, WestLaw, LexisNexis)</li>
            <li>Programming languages</li>
            <li>Data analysis capabilities</li>
            <li>Technical writing skills</li>
          </ul>
          <p className="mt-3 mb-3">
            Organize skills by category rather than listing them randomly, and indicate proficiency levels where relevant.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Example:</p>
            <p className="text-sm italic text-amber-700 mt-1">
              "Technical Skills: WestLaw, LexisNexis, Advanced Legal Research Methods, Regulatory Analysis, Academic Writing,
              Case Analysis, NVIVO, Microsoft Office Suite, Legal Document Management, GDPR Compliance"
            </p>
          </div>
        </>
      )
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Detail your academic background with GPA, relevant coursework, and leadership positions.',
      content: (
        <>
          <p className="mb-3">For each educational institution, include:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Full institution name and location</li>
            <li>Degree earned with honors/distinctions</li>
            <li>GPA (if 3.0 or higher)</li>
            <li>Relevant coursework that aligns with target program</li>
            <li>Academic awards and scholarships</li>
            <li>Leadership roles in academic settings</li>
            <li>Study abroad experiences</li>
          </ul>
          <p className="mt-3">
            List institutions in reverse chronological order, with your most recent degree first.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Example:</p>
            <p className="text-sm italic text-amber-700 mt-1">
              "LANCASTER UNIVERSITY, Ghana<br />
              • Academic Standing: First Class Honors (3.5/4.0) Oct 2021 - Jun 2024<br />
              • Program: Bachelor of Laws (LLB)<br />
              • Relevant Coursework: Company Law, Public International Law, International Human Rights Law<br />
              • Awards: Lancaster Award Gold (Employability Award), Leadership Award"
            </p>
          </div>
        </>
      )
    },
    {
      id: 'research',
      title: 'Academic/Research Projects/Publications',
      description: 'Showcase your research experience, methodologies, and findings.',
      content: (
        <>
          <p className="mb-3">For each research project or publication, include:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Title of research/publication</li>
            <li>Your role in the research</li>
            <li>Methodology used</li>
            <li>Key findings or impact</li>
            <li>Publication details (if applicable)</li>
            <li>Grants or funding received</li>
            <li>Presentations at conferences or symposiums</li>
          </ul>
          <p className="mt-3">
            Structure this section to emphasize your technical competencies and intellectual contributions.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Example:</p>
            <p className="text-sm italic text-amber-700 mt-1">
              "INTELLECTUAL PROPERTY LAW CHALLENGES OF ARTIFICIAL INTELLIGENCE USAGE<br />
              • Research Approach: Doctrinal Research, Case Law Review, Comparative Analysis<br />
              • Research Findings: Identified gaps in current IP frameworks for AI-generated works, analyzed judicial rulings on AI and IP rights, and developed recommendations for legislative reform"
            </p>
          </div>
        </>
      )
    },
    {
      id: 'volunteering',
      title: 'Volunteering & Leadership Experiences',
      description: 'Highlight community involvement and leadership skills.',
      content: (
        <>
          <p className="mb-3">Select experiences that demonstrate:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Leadership capabilities</li>
            <li>Project management skills</li>
            <li>Commitment to service in your field</li>
            <li>Cross-cultural competence</li>
            <li>Collaboration and teamwork</li>
            <li>Initiative and problem-solving</li>
          </ul>
          <p className="mt-3">
            Focus on roles that complement your academic and career objectives rather than listing every volunteer position.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <p className="text-sm text-amber-800 font-medium">Example:</p>
            <p className="text-sm italic text-amber-700 mt-1">
              "Welfare Officer | Student Representative Council, Lancaster University Ghana<br />
              • Advocated for student welfare, initiating 5+ campaigns addressing mental health and social well-being<br />
              • Coordinated logistics for campus-wide events, managing teams to execute 10+ successful programs"
            </p>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold flex items-center">
            <GraduationCap size={20} className="mr-2 text-primary-600" />
            Graduate School CV Prioritization Guide
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-primary-50 border-b border-primary-100">
          <div className="flex items-start">
            <Info size={20} className="text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-primary-800">
              The sections below are arranged in order of priority for graduate school applications. 
              Click on each section to see detailed guidance, and use the "Go to Section" button to navigate 
              directly to that part of your CV.
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer ${
                    expandedSection === section.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-primary-100 text-primary-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  {expandedSection === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedSection === section.id && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="text-gray-700 text-sm">{section.content}</div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleNavigate(section.id === 'summary' ? 'personal' : 
                                          section.id === 'technical' || section.id === 'research' ? 'skills' : 
                                          section.id === 'education' ? 'education' : 'experience')}
                        className="inline-flex items-center text-sm bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700"
                      >
                        <BookOpen size={16} className="mr-1.5" />
                        Go to Section
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVSectionGuide;
