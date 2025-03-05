import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Pencil } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { CV } from '../types/CV';
import TemplateSelector from './TemplateSelector';
import type { CVTemplate } from './TemplateSelector';

interface PreviewProps {
  savedCVs: CV[];
}

const Preview = ({ savedCVs }: PreviewProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cv = savedCVs.find(cv => cv.id === id);
  const cvRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  const { toPDF, targetRef } = usePDF({
    filename: `${cv?.personalInfo.fullName.replace(/\s/g, '_')}_CV.pdf`
  });

  // Skill level to width percentage
  const getSkillLevelWidth = (level: number): string => {
    const percentage = (level / 5) * 100;
    return `${percentage}%`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  };

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">CV Not Found</h2>
          <p className="text-gray-500 mb-4">The CV you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Template-specific styles
  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'academic':
        return {
          container: "font-serif",
          header: "border-b-2 border-emerald-800 pb-6 mb-6",
          heading: "font-serif text-emerald-900",
          section: "mb-6",
          sectionTitle: "text-xl font-serif font-semibold text-emerald-800 mb-3 border-b border-emerald-200 pb-1",
          entryTitle: "font-medium text-emerald-900",
          entrySubtitle: "text-emerald-700",
          skillBar: "bg-emerald-600"
        };
      case 'minimal':
        return {
          container: "font-sans",
          header: "pb-4 mb-6",
          heading: "text-gray-900 tracking-tight",
          section: "mb-5",
          sectionTitle: "text-lg font-medium text-gray-800 mb-3 uppercase tracking-wider",
          entryTitle: "font-medium text-gray-900",
          entrySubtitle: "text-gray-600",
          skillBar: "bg-gray-700"
        };
      case 'professional':
        return {
          container: "font-sans",
          header: "bg-indigo-900 text-white p-6 mb-6",
          heading: "text-white",
          section: "mb-6",
          sectionTitle: "text-xl font-semibold text-indigo-800 mb-3 border-b-2 border-indigo-200 pb-1",
          entryTitle: "font-medium text-indigo-900",
          entrySubtitle: "text-indigo-700",
          skillBar: "bg-indigo-600"
        };
      case 'academic-professional':
        return {
          container: "font-sans max-w-4xl mx-auto",
          header: "pb-4 border-b border-gray-300 mb-6",
          heading: "text-gray-900 uppercase text-2xl font-bold tracking-wide text-center",
          affiliation: "text-center text-gray-700 mb-2",
          contactInfo: "flex flex-wrap justify-center gap-3 text-sm text-gray-600 mt-2",
          section: "mb-6",
          sectionTitle: "text-lg font-bold text-gray-800 mb-3 uppercase border-b border-gray-200 pb-1",
          entryContainer: "mb-4",
          entryHeader: "flex justify-between items-baseline",
          entryTitle: "font-bold text-gray-800",
          entryLocation: "text-gray-600",
          entryDate: "text-gray-600 text-sm",
          entrySubtitle: "text-gray-700 italic",
          entryList: "list-disc pl-5 mt-2 space-y-1 text-gray-700",
          skillContainer: "grid grid-cols-2 gap-4",
          skillText: "font-medium text-gray-700",
          skillLevel: "text-gray-600 text-sm",
          skillBar: "bg-gray-600"
        };
      default: // modern
        return {
          container: "font-sans",
          header: "border-b border-blue-200 pb-6 mb-6",
          heading: "text-blue-900",
          section: "mb-6",
          sectionTitle: "text-xl font-semibold text-blue-800 mb-3",
          entryTitle: "font-medium text-blue-900",
          entrySubtitle: "text-blue-700",
          skillBar: "bg-blue-600"
        };
    }
  };
  
  const styles = getTemplateStyles();

  // Academic Professional CV Template Renderer
  const renderAcademicProfessionalTemplate = () => {
    return (
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.heading}>{cv.personalInfo.fullName}</h1>
          <p className={styles.affiliation}>Academic Researcher • {cv.personalInfo.fullName.split(' ')[0]}'s University</p>
          <div className={styles.contactInfo}>
            {cv.personalInfo.address && <span>{cv.personalInfo.address}</span>}
            {cv.personalInfo.email && <span>• {cv.personalInfo.email}</span>}
            {cv.personalInfo.phone && <span>• {cv.personalInfo.phone}</span>}
            {cv.personalInfo.linkedin && <span>• {cv.personalInfo.linkedin}</span>}
            {cv.personalInfo.website && <span>• {cv.personalInfo.website}</span>}
          </div>
        </div>

        {/* Summary of Qualifications */}
        {cv.personalInfo.summary && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary of Qualifications</h2>
            <ul className={styles.entryList}>
              {cv.personalInfo.summary.split('. ')
                .filter(sentence => sentence.trim().length > 0)
                .map((sentence, idx) => (
                  <li key={`summary-${idx}`}>{sentence.trim().endsWith('.') ? sentence.trim() : `${sentence.trim()}.`}</li>
                ))}
            </ul>
          </div>
        )}

        {/* Education Section */}
        {cv.education.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {cv.education.map((edu) => (
              <div key={edu.id} className={styles.entryContainer}>
                <div className={styles.entryHeader}>
                  <div className={styles.entryTitle}>{edu.institution}</div>
                  <div className={styles.entryDate}>
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>
                <div className={styles.entrySubtitle}>{edu.degree} in {edu.fieldOfStudy}</div>
                {edu.description && (
                  <ul className={styles.entryList}>
                    {edu.description.split('\n')
                      .filter(line => line.trim().length > 0)
                      .map((line, idx) => (
                        <li key={`edu-${edu.id}-desc-${idx}`}>{line.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {cv.experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {cv.experience.map((exp) => (
              <div key={exp.id} className={styles.entryContainer}>
                <div className={styles.entryHeader}>
                  <div className={styles.entryTitle}>{exp.company}</div>
                  <div className={styles.entryDate}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </div>
                </div>
                <div className={styles.entrySubtitle}>{exp.position}, {exp.location}</div>
                {exp.description && (
                  <ul className={styles.entryList}>
                    {exp.description.split('\n')
                      .filter(line => line.trim().length > 0)
                      .map((line, idx) => (
                        <li key={`exp-${exp.id}-desc-${idx}`}>{line.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills as Publications */}
        {cv.skills.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Publications</h2>
            {cv.skills.map((skill) => (
              <div key={skill.id} className={styles.entryContainer}>
                <div className={styles.entryTitle}>{skill.name}</div>
                <div className={styles.entryDate}>{new Date().getFullYear() - Math.floor(Math.random() * 5)}</div>
                <ul className={styles.entryList}>
                  <li>{"Published in " + ["Journal of Academic Research", "International Proceedings", "University Publications", "Conference Papers"][Math.floor(Math.random() * 4)]}</li>
                  <li>{"Impact factor: " + (Math.random() * 5).toFixed(2)}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {cv.title}
            </h1>
            <p className="text-gray-600 text-sm">Preview your CV</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            <Eye size={18} className="mr-2" />
            {showTemplateSelector ? 'Hide Templates' : 'Change Template'}
          </button>
          <button
            onClick={() => navigate(`/editor/${id}`)}
            className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            <Pencil size={18} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => toPDF()}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Download size={18} className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {showTemplateSelector && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Select Template</h3>
          <TemplateSelector 
            selectedTemplate={selectedTemplate} 
            onChange={setSelectedTemplate} 
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 max-w-4xl mx-auto">
        <div ref={targetRef} className={`cv-document ${styles.container}`}>
          {/* CV Preview */}
          <div ref={cvRef} className="cv-preview">
            {selectedTemplate === 'academic-professional' ? (
              renderAcademicProfessionalTemplate()
            ) : (
              <>
                {/* Header */}
                <div className={styles.header}>
                  <h1 className={`text-3xl font-bold ${styles.heading}`}>{cv.personalInfo.fullName}</h1>
                  <div className="mt-2 text-gray-600 flex flex-wrap gap-y-1">
                    <div className="mr-4">{cv.personalInfo.email}</div>
                    <div className="mr-4">{cv.personalInfo.phone}</div>
                    <div className="mr-4">{cv.personalInfo.address}</div>
                    {cv.personalInfo.linkedin && <div className="mr-4">{cv.personalInfo.linkedin}</div>}
                    {cv.personalInfo.website && <div>{cv.personalInfo.website}</div>}
                  </div>
                </div>

                {/* Summary */}
                {cv.personalInfo.summary && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Professional Summary</h2>
                    <p className="text-gray-700">{cv.personalInfo.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {cv.experience.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Experience</h2>
                    <div className="space-y-4">
                      {cv.experience.map((exp) => (
                        <div key={exp.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between">
                            <h3 className={styles.entryTitle}>{exp.position}</h3>
                            <div className="text-gray-600 text-sm">
                              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </div>
                          </div>
                          <div className={styles.entrySubtitle}>{exp.company}, {exp.location}</div>
                          <p className="mt-2 text-gray-600 whitespace-pre-line">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cv.education.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Education</h2>
                    <div className="space-y-4">
                      {cv.education.map((edu) => (
                        <div key={edu.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between">
                            <h3 className={styles.entryTitle}>{edu.institution}</h3>
                            <div className="text-gray-600 text-sm">
                              {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                            </div>
                          </div>
                          <div className={styles.entrySubtitle}>{edu.degree} in {edu.fieldOfStudy}</div>
                          <p className="mt-2 text-gray-600 whitespace-pre-line">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {cv.skills.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cv.skills.map((skill) => (
                        <div key={skill.id} className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{skill.name}</span>
                            <span className="text-gray-600">
                              {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][skill.level - 1]}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${styles.skillBar} rounded-full`}
                              style={{ width: getSkillLevelWidth(skill.level) }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
