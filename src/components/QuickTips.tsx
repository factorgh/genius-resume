import React, { useState } from "react";
import { Lightbulb, X } from "lucide-react";

interface QuickTipsProps {
  section: string;
  targetProgram?: string;
}

const QuickTips: React.FC<QuickTipsProps> = ({ section, targetProgram }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getTipsForSection = () => {
    switch (section) {
      case "personal":
        return {
          title: "Personal Information Tips",
          tips: [
            "Use a professional email address that includes your name",
            "Include your LinkedIn profile with a customized URL",
            "For academic CVs, you may include professional affiliations",
            "Your summary should directly address the requirements of your target program",
            "Avoid personal information like age, marital status, or photos",
          ],
        };
      case "education":
        return {
          title: "Education Section Tips",
          tips: [
            "List education in reverse chronological order (most recent first)",
            "Include GPA if it's 3.0 or higher",
            "Mention academic honors, scholarships, and relevant coursework",
            "For graduate applications, highlight research projects or theses",
            `${
              targetProgram
                ? `Emphasize courses relevant to ${targetProgram}`
                : "Emphasize courses relevant to your target program"
            }`,
          ],
        };
      case "experience":
        return {
          title: "Experience Section Tips",
          tips: [
            "Use action verbs to begin each bullet point (e.g., Conducted, Analyzed, Developed)",
            "Quantify your achievements where possible (e.g., Increased, Reduced by 20%)",
            "Focus on research, teaching, or academic-related experience for graduate programs",
            "Highlight transferable skills relevant to academic settings",
            "Include relevant volunteer work, especially if it demonstrates leadership or research skills",
          ],
        };
      case "skills":
        return {
          title: "Skills Section Tips",
          tips: [
            "Group similar skills into categories (e.g., Research Methods, Software, Languages)",
            "For academic CVs, emphasize technical and research skills",
            "Include relevant software proficiencies specific to your field",
            "List foreign languages with proficiency levels",
            "Focus on skills mentioned in program requirements",
          ],
        };
      default:
        return {
          title: "CV Tips",
          tips: [
            "Keep your CV focused on academic and professional achievements",
            "Use consistent formatting throughout your document",
            "Proofread carefully for grammar and spelling errors",
            "Tailor your content to your target program",
            "Use the AI enhancement feature to improve your descriptions",
          ],
        };
    }
  };

  const { title, tips } = getTipsForSection();

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6 animate-slideIn">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Lightbulb size={18} className="text-amber-600 mr-2" />
          <h3 className="font-medium text-amber-800">{title}</h3>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 hover:text-amber-900 p-1"
          aria-label="Dismiss tips"
        >
          <X size={16} />
        </button>
      </div>
      <ul className="space-y-1 ml-6 text-sm text-amber-700 list-disc">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuickTips;
