import { useState } from "react";
import {
  Check,
  Cpu,
  FileText,
  Sparkles,
  Terminal,
  User,
  X,
} from "lucide-react";

import { AITargetSchool } from "./AIEnhancer";
import { generateContentForAi } from "../../utils/GenerateContForAi";

interface AIGeneratorField {
  label: string;
  key: string;
  icon: React.ReactNode;
  description: string;
}

interface AIContentGeneratorProps {
  onClose: () => void;
  onApplyContent: (type: string, content: string) => void;
  targetSchool?: AITargetSchool;
}

const AIContentGenerator = ({
  onClose,
  onApplyContent,
  targetSchool,
}: AIContentGeneratorProps) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const fields: AIGeneratorField[] = [
    {
      label: "Academic Profile",
      key: "generate-summary",
      icon: <User size={18} className="text-blue-600" />,
      description:
        "Create a compelling academic summary that highlights your educational background and research interests",
    },
    {
      label: "Research Experience",
      key: "generate-experience",
      icon: <Terminal size={18} className="text-green-600" />,
      description:
        "Generate academic research experience descriptions with strong accomplishments and methodologies",
    },
    {
      label: "Academic Skills",
      key: "generate-skills",
      icon: <Cpu size={18} className="text-purple-600" />,
      description:
        "Create a comprehensive skills list relevant to your target program or academic field",
    },
  ];

  const generateContent = async () => {
    if (!selectedField) return;

    setIsGenerating(true);
    try {
      // const response = await AIService.enhanceContent({
      //   field: selectedField,
      //   context: {
      //     targetProgram: targetSchool?.program,
      //     programRequirements: targetSchool?.requirements
      //   }
      // });

      const prompt = `Enhance the following content for clarity and engagement: "${targetSchool?.requirements}"`;
      const enhancedText = await generateContentForAi(prompt);

      setGeneratedContent(enhancedText);
    } catch (error) {
      console.error("Content generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (selectedField && generatedContent) {
      onApplyContent(selectedField, generatedContent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Sparkles size={18} className="mr-2 text-amber-500" />
            AI Content Generator
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!generatedContent ? (
            <>
              <p className="text-gray-600 mb-6">
                Select a section to generate AI-powered content for your CV.
                {targetSchool?.program && (
                  <span>
                    {" "}
                    Content will be tailored to your target program:{" "}
                    <strong>{targetSchool.program}</strong>
                  </span>
                )}
              </p>

              <div className="space-y-3">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    onClick={() => setSelectedField(field.key)}
                    className={`p-4 border rounded-lg cursor-pointer flex items-start transition-colors ${
                      selectedField === field.key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mr-3 p-2 rounded-full bg-gray-100">
                      {field.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">
                          {field.label}
                        </h4>
                        {selectedField === field.key && (
                          <Check size={18} className="text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {field.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <FileText size={18} className="mr-2 text-gray-600" />
                <h4 className="font-medium text-gray-800">
                  {fields.find((f) => f.key === selectedField)?.label ||
                    "Generated Content"}
                </h4>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-line">
                {generatedContent}
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-md p-3 text-amber-800 text-sm">
                <p className="font-medium">AI-Generated Content</p>
                <p className="mt-1">
                  This content is generated based on best practices for academic
                  CVs. Edit it to accurately reflect your specific experiences
                  and qualifications.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          {!generatedContent ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={generateContent}
                disabled={!selectedField || isGenerating}
                className={`px-4 py-2 rounded-md flex items-center ${
                  !selectedField || isGenerating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isGenerating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isGenerating ? "Generating..." : "Generate Content"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setGeneratedContent("")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply to CV
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator;
