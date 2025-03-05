import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { generateContentForAi } from "../../utils/GenerateContForAi";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  CircleHelp,
  CirclePlus,
  Cpu,
  FileText,
  GraduationCap,
  Info,
  Save,
  School,
  Sparkles,
  Trash2,
  User,
  Wand,
  X,
} from "lucide-react";

import { CV, Education, Experience, Skill } from "../types/CV";
import AISuggestions from "./AISuggestions";
import AIEnhancer, { AITargetSchool } from "./AIEnhancer";
import AIContentGenerator from "./AIContentGenerator";
import SchoolTargetModal from "./JobTargetModal";
import CVSectionGuide from "./CVSectionGuide";
import { AIService } from "../services/AIService";

interface CVEditorProps {
  savedCVs: CV[];
  saveCV: (cv: CV) => void;
}

const CVEditor = ({ savedCVs, saveCV }: CVEditorProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState("personal");
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [aiShowFor, setAiShowFor] = useState<any | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiModeActive, setAiModeActive] = useState(false);
  const [showSchoolTargetModal, setShowSchoolTargetModal] = useState(false);
  const [targetSchool, setTargetSchool] = useState<
    AITargetSchool | undefined
  >();
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [showSectionGuide, setShowSectionGuide] = useState(false);
  const [currentEnhancement, setCurrentEnhancement] = useState<{
    title: string;
    fieldKey: string;
    originalContent: string;
  } | null>(null);

  const { register, handleSubmit, setValue } = useForm<CV>({
    defaultValues: {
      id: "",
      title: "Untitled CV",
      lastModified: new Date().toISOString(),
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        website: "",
        summary: "",
      },
      education: [],
      experience: [],
      skills: [],
    },
  });

  // Initialize OpenAI API key from environment variables
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
    if (apiKey) {
      AIService.initialize(apiKey);
    } else {
      console.warn(
        "No OpenAI API key found. AI enhancement will use fallback mode."
      );
    }
  }, []);

  // Load existing CV data if editing
  useEffect(() => {
    if (id) {
      const existingCV = savedCVs.find((cv) => cv.id === id);
      if (existingCV) {
        setValue("id", existingCV.id);
        setValue("title", existingCV.title);
        setValue("lastModified", existingCV.lastModified);
        setValue("personalInfo", existingCV.personalInfo);

        setEducationList(existingCV.education);
        setExperienceList(existingCV.experience);
        setSkillsList(existingCV.skills);
      }
    }
  }, [id, savedCVs, setValue]);

  // Add new education entry
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setEducationList([...educationList, newEducation]);
  };

  // Remove education entry
  const removeEducation = (id: string) => {
    setEducationList(educationList.filter((edu) => edu.id !== id));
  };

  // Add new experience entry
  const addExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setExperienceList([...experienceList, newExperience]);
  };

  // Remove experience entry
  const removeExperience = (id: string) => {
    setExperienceList(experienceList.filter((exp) => exp.id !== id));
  };

  // Add new skill entry
  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: "",
      level: 3,
    };
    setSkillsList([...skillsList, newSkill]);
  };

  // Remove skill entry
  const removeSkill = (id: string) => {
    setSkillsList(skillsList.filter((skill) => skill.id !== id));
  };

  // Update specific education field
  const updateEducation = (id: string, field: string, value: string) => {
    setEducationList(
      educationList.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  // Update specific experience field
  const updateExperience = (id: string, field: string, value: string) => {
    setExperienceList(
      experienceList.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Update specific skill field
  const updateSkill = (id: string, field: string, value: string | number) => {
    setSkillsList(
      skillsList.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  // Handle AI enhancement
  const handleEnhance = async (inputText: string) => {
    if (!inputText.trim()) return;

    setIsProcessingAI(true);
    try {
      const prompt = `Enhance the following content for clarity and engagement: "${inputText}"`;
      const enhancedText = await generateContentForAi(prompt);

      console.log("AI enhanced:", enhancedText);
      return enhancedText;
    } catch (error) {
      console.error("AI enhancement failed:", error);
      return inputText;
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Handle AI enhancement
  const enhanceWithAI = async (field: string, text: string) => {
    if (!text.trim()) return;

    setIsProcessingAI(true);
    try {
      // In a real implementation, this would call the OpenAI API
      // const enhancedText = await mockEnhanceWithAI(text);

      const enhancedText = await handleEnhance(text);

      console.log("AI enhanced:", enhancedText);
      setAiShowFor({ field, original: text, enhanced: enhancedText } as any);
    } catch (error) {
      console.error("AI enhancement failed:", error);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Open advanced AI enhancer
  const openAdvancedEnhancer = (
    title: string,
    fieldKey: string,
    content: string
  ) => {
    setCurrentEnhancement({
      title,
      fieldKey,
      originalContent: content,
    });
  };

  // Apply AI suggestion
  const applyAISuggestion = (text: string) => {
    if (!aiShowFor) return;

    if (aiShowFor.field === "summary") {
      setValue("personalInfo.summary", text, { shouldDirty: true });
    } else if (aiShowFor.field.startsWith("education-")) {
      const eduId = aiShowFor.field.split("-")[1];
      updateEducation(eduId, "description", text);
    } else if (aiShowFor.field.startsWith("experience-")) {
      const expId = aiShowFor.field.split("-")[1];
      updateExperience(expId, "description", text);
    }

    setAiShowFor(null);
  };

  // Apply advanced AI enhancement
  const applyAdvancedEnhancement = (text: string) => {
    if (!currentEnhancement) return;

    const { fieldKey } = currentEnhancement;

    if (fieldKey === "summary") {
      setValue("personalInfo.summary", text, { shouldDirty: true });
    } else if (fieldKey.startsWith("education-")) {
      const eduId = fieldKey.split("-")[1];
      updateEducation(eduId, "description", text);
    } else if (fieldKey.startsWith("experience-")) {
      const expId = fieldKey.split("-")[1];
      updateExperience(expId, "description", text);
    }

    setCurrentEnhancement(null);
  };

  // Apply AI generated content
  const applyGeneratedContent = (type: string, content: string) => {
    switch (type) {
      case "generate-summary":
        setValue("personalInfo.summary", content, { shouldDirty: true });
        break;
      case "generate-experience":
        if (experienceList.length > 0) {
          // Update the most recent experience
          const latestExp = experienceList[0];
          updateExperience(latestExp.id, "description", content);
        }
        break;
      case "generate-skills":
        // Clear existing skills and add new ones from the comma-separated list
        const skillNames = content.split(",").map((s) => s.trim());
        const newSkills = skillNames.map((name) => ({
          id: uuidv4(),
          name,
          level: 4, // Default to advanced level
        }));
        setSkillsList(newSkills);
        break;
    }
  };

  // Save the CV
  const onSubmit = (data: any) => {
    const finalCV: CV = {
      ...data,
      id: id || uuidv4(),
      lastModified: new Date().toISOString(),
      education: educationList,
      experience: experienceList,
      skills: skillsList,
    };

    saveCV(finalCV);
    navigate("/");
  };

  // Toggle the AI mode
  const toggleAIMode = () => {
    setAiModeActive(!aiModeActive);
    if (!aiModeActive && !targetSchool) {
      // Show school target modal when enabling AI mode for the first time
      setShowSchoolTargetModal(true);
    }
  };

  // Navigate to a specific section
  const navigateToSection = (sectionName: string) => {
    setActiveSection(sectionName);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="mr-4 p-2 rounded-full hover:bg-primary-100 transition-colors text-primary-600"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-heading text-neutral-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">
              {id ? "Edit CV" : "Create New CV"}
            </span>
          </h1>
          <p className="text-neutral-700 mt-2 text-lg">
            Complete the sections below to create your professional CV
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSectionGuide(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-all duration-300"
          >
            <FileText size={18} />
            <span>Section Guide</span>
          </button>
          <button
            onClick={toggleAIMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              aiModeActive
                ? "bg-accent-500 text-white shadow-gold"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <Sparkles
              size={18}
              className={aiModeActive ? "animate-pulse-gentle" : ""}
            />
            <span>AI Mode {aiModeActive ? "Active" : "Off"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar navigation */}
          <div className="w-full md:w-64 bg-primary-500 border-r border-primary-600">
            <nav className="p-4 md:p-6">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection("personal")}
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === "personal"
                        ? "bg-white text-primary-700 font-medium"
                        : "text-white hover:bg-primary-400/20"
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    Personal Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("education")}
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === "education"
                        ? "bg-white text-primary-700 font-medium"
                        : "text-white hover:bg-primary-400/20"
                    }`}
                  >
                    <BookOpen size={18} className="mr-3" />
                    Education
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("experience")}
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === "experience"
                        ? "bg-white text-primary-700 font-medium"
                        : "text-white hover:bg-primary-400/20"
                    }`}
                  >
                    <Briefcase size={18} className="mr-3" />
                    Experience
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("skills")}
                    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === "skills"
                        ? "bg-white text-primary-700 font-medium"
                        : "text-white hover:bg-primary-400/20"
                    }`}
                  >
                    <Cpu size={18} className="mr-3" />
                    Skills
                  </button>
                </li>
              </ul>

              {aiModeActive && (
                <div className="mt-8 space-y-4">
                  <div className="px-4">
                    <h3 className="text-sm uppercase text-white/80 font-medium tracking-wider">
                      AI Tools
                    </h3>
                  </div>

                  <div className="rounded-lg bg-white/10 border border-white/20 p-4">
                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-full p-2 mt-1">
                        <School size={18} className="text-white" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-white mb-1">
                          Target School/Program
                        </h4>
                        {targetSchool?.program ? (
                          <div>
                            <p className="text-sm text-white/90">
                              {targetSchool.program}
                            </p>
                            {targetSchool.name && (
                              <p className="text-xs text-white/80 mt-1">
                                {targetSchool.name}
                              </p>
                            )}
                            <button
                              onClick={() => setShowSchoolTargetModal(true)}
                              className="text-xs text-white/80 mt-2 hover:text-white underline"
                            >
                              Change target program
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowSchoolTargetModal(true)}
                            className="text-sm text-white/80 hover:text-white underline"
                          >
                            Set target program
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowContentGenerator(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-colors shadow-gold"
                  >
                    <Sparkles size={18} />
                    <span>Generate Content</span>
                  </button>

                  <div className="px-4 py-3">
                    <button
                      onClick={() => setShowSectionGuide(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary-400/30 text-white hover:bg-primary-400/40 transition-colors border border-white/20"
                    >
                      <GraduationCap size={18} />
                      <span>Academic CV Guide</span>
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* CV Title */}
              <div className="mb-8">
                <label className="block text-neutral-700 text-sm font-medium mb-2">
                  CV Title
                </label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow duration-300 hover:shadow-sm"
                />
              </div>

              {/* Personal Information Section */}
              {activeSection === "personal" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6 font-heading">
                      Personal Information
                    </h2>

                    <div className="flex items-center">
                      <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-1.5 flex items-center text-blue-800 text-sm mr-2">
                        <Info size={16} className="mr-1.5" />
                        <span>Priority Section</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSectionGuide(true)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
                      >
                        <CircleHelp size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        {...register("personalInfo.fullName")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("personalInfo.email")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        {...register("personalInfo.phone")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Address
                      </label>
                      <input
                        {...register("personalInfo.address")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        LinkedIn (optional)
                      </label>
                      <input
                        {...register("personalInfo.linkedin")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-neutral-700 text-sm font-medium mb-2">
                        Website (optional)
                      </label>
                      <input
                        {...register("personalInfo.website")}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 group-hover:shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-neutral-700 text-sm font-medium">
                        Academic Summary (Recommended for Graduate School)
                      </label>
                      {aiModeActive ? (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              openAdvancedEnhancer(
                                "Professional Summary",
                                "summary",
                                (
                                  document.getElementById(
                                    "summary"
                                  ) as HTMLTextAreaElement
                                )?.value
                              )
                            }
                            className="inline-flex items-center text-sm text-primary-600 bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors"
                          >
                            <Wand size={16} className="mr-1.5" />
                            Enhance
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            enhanceWithAI(
                              "summary",
                              (
                                document.getElementById(
                                  "summary"
                                ) as HTMLTextAreaElement
                              )?.value
                            )
                          }
                          disabled={isProcessingAI}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <Wand size={16} className="mr-1.5" />
                          {isProcessingAI ? "Enhancing..." : "Enhance with AI"}
                        </button>
                      )}
                    </div>
                    <textarea
                      id="summary"
                      {...register("personalInfo.summary")}
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                      placeholder="Summarize your academic qualifications, research interests, and key strengths relevant to your target graduate program."
                    ></textarea>
                    <p className="mt-2 text-sm text-neutral-500">
                      <Info size={14} className="inline mr-1" />
                      For graduate school, your summary should highlight
                      academic achievements, research experience, and specific
                      qualifications aligned with your target program.
                    </p>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 font-heading">
                      Education
                    </h2>
                    <div className="flex items-center">
                      <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-1.5 flex items-center text-blue-800 text-sm mr-2">
                        <Info size={16} className="mr-1.5" />
                        <span>High Priority Section</span>
                      </div>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="group inline-flex items-center text-sm bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <CirclePlus
                          size={18}
                          className="mr-2 transition-transform duration-300 group-hover:rotate-90"
                        />
                        Add Education
                      </button>
                    </div>
                  </div>

                  {educationList.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                      <BookOpen
                        size={48}
                        className="mx-auto text-neutral-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        No education entries yet
                      </h3>
                      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        Education is a critical section for graduate school
                        applications. Add your academic background to strengthen
                        your CV.
                      </p>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-button"
                      >
                        <CirclePlus size={18} className="mr-2" />
                        Add Education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {educationList.map((edu, index) => (
                        <div
                          key={edu.id}
                          className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex justify-between items-start mb-5">
                            <h3 className="font-medium text-lg text-neutral-800">
                              Education #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Institution
                              </label>
                              <input
                                value={edu.institution}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "institution",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Degree
                              </label>
                              <input
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "degree",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Field of Study
                              </label>
                              <input
                                value={edu.fieldOfStudy}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "fieldOfStudy",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-neutral-700 text-sm font-medium mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    updateEducation(
                                      edu.id,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-neutral-700 text-sm font-medium mb-2">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    updateEducation(
                                      edu.id,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-neutral-700 text-sm font-medium">
                                Description
                              </label>
                              {aiModeActive ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openAdvancedEnhancer(
                                      "Education Description",
                                      `education-${edu.id}`,
                                      edu.description
                                    )
                                  }
                                  className="inline-flex items-center text-sm text-primary-600 bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors"
                                >
                                  <Wand size={16} className="mr-1.5" />
                                  Enhance
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    enhanceWithAI(
                                      `education-${edu.id}`,
                                      edu.description
                                    )
                                  }
                                  disabled={isProcessingAI}
                                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
                                >
                                  <Wand size={16} className="mr-1.5" />
                                  {isProcessingAI
                                    ? "Enhancing..."
                                    : "Enhance with AI"}
                                </button>
                              )}
                            </div>
                            <textarea
                              value={edu.description}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              placeholder="Include GPA, academic honors, relevant coursework, and research projects"
                            ></textarea>
                            <p className="mt-2 text-sm text-neutral-500">
                              <Info size={14} className="inline mr-1" />
                              For graduate school applications, include GPA (if
                              3.0+), relevant coursework, academic honors, and
                              research projects.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 font-heading">
                      Experience
                    </h2>
                    <div className="flex items-center">
                      <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-1.5 flex items-center text-blue-800 text-sm mr-2">
                        <Info size={16} className="mr-1.5" />
                        <span>Important Section</span>
                      </div>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="group inline-flex items-center text-sm bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <CirclePlus
                          size={18}
                          className="mr-2 transition-transform duration-300 group-hover:rotate-90"
                        />
                        Add Experience
                      </button>
                    </div>
                  </div>

                  {experienceList.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                      <Briefcase
                        size={48}
                        className="mx-auto text-neutral-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        No experience entries yet
                      </h3>
                      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        For academic CVs, include research experience, teaching
                        assistantships, or relevant professional positions
                      </p>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="inline-flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-button"
                      >
                        <CirclePlus size={18} className="mr-2" />
                        Add Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {experienceList.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex justify-between items-start mb-5">
                            <h3 className="font-medium text-lg text-neutral-800">
                              Experience #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Organization/Lab/Company
                              </label>
                              <input
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "company",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Position/Role
                              </label>
                              <input
                                value={exp.position}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "position",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-700 text-sm font-medium mb-2">
                                Location
                              </label>
                              <input
                                value={exp.location}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "location",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-neutral-700 text-sm font-medium mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    updateExperience(
                                      exp.id,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-neutral-700 text-sm font-medium mb-2">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    updateExperience(
                                      exp.id,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-neutral-700 text-sm font-medium">
                                Description
                              </label>
                              {aiModeActive ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openAdvancedEnhancer(
                                      "Experience Description",
                                      `experience-${exp.id}`,
                                      exp.description
                                    )
                                  }
                                  className="inline-flex items-center text-sm text-primary-600 bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors"
                                >
                                  <Wand size={16} className="mr-1.5" />
                                  Enhance
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    enhanceWithAI(
                                      `experience-${exp.id}`,
                                      exp.description
                                    )
                                  }
                                  disabled={isProcessingAI}
                                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
                                >
                                  <Wand size={16} className="mr-1.5" />
                                  {isProcessingAI
                                    ? "Enhancing..."
                                    : "Enhance with AI"}
                                </button>
                              )}
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:shadow-sm"
                              placeholder="Focus on research methods, academic achievements, and skills relevant to your graduate program"
                            ></textarea>
                            <p className="mt-2 text-sm text-neutral-500">
                              <Info size={14} className="inline mr-1" />
                              For academic CVs, emphasize research
                              methodologies, publications, presentations, and
                              technical skills relevant to your field.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 font-heading">
                      Technical & Academic Skills
                    </h2>
                    <div className="flex items-center">
                      <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-1.5 flex items-center text-blue-800 text-sm mr-2">
                        <Info size={16} className="mr-1.5" />
                        <span>Priority Section</span>
                      </div>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="group inline-flex items-center text-sm bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <CirclePlus
                          size={18}
                          className="mr-2 transition-transform duration-300 group-hover:rotate-90"
                        />
                        Add Skill
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-800 mb-1">
                      Academic CV Tip
                    </h3>
                    <p className="text-sm text-amber-700">
                      For graduate school applications, prioritize technical
                      competencies relevant to your field such as research
                      methodologies, laboratory techniques, specialized
                      software, programming languages, and data analysis
                      capabilities.
                    </p>
                  </div>

                  {skillsList.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                      <Cpu
                        size={48}
                        className="mx-auto text-neutral-300 mb-4"
                      />
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        No skills added yet
                      </h3>
                      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        Include relevant technical and academic competencies to
                        demonstrate your qualifications
                      </p>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="inline-flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-button"
                      >
                        <CirclePlus size={18} className="mr-2" />
                        Add Skill
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {skillsList.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 flex items-center hover:shadow-sm transition-shadow duration-300"
                        >
                          <div className="flex-1">
                            <input
                              value={skill.name}
                              onChange={(e) =>
                                updateSkill(skill.id, "name", e.target.value)
                              }
                              placeholder="Skill name (e.g., Statistical Analysis, SPSS, Research Design)"
                              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                            />
                          </div>
                          <div className="w-1/3 px-2">
                            <select
                              value={skill.level}
                              onChange={(e) =>
                                updateSkill(
                                  skill.id,
                                  "level",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white transition-all duration-300"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232D665F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 10px center",
                                backgroundSize: "20px",
                              }}
                            >
                              <option value={1}>Beginner</option>
                              <option value={2}>Elementary</option>
                              <option value={3}>Intermediate</option>
                              <option value={4}>Advanced</option>
                              <option value={5}>Expert</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-2 text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Save Button */}
              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-button hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Save size={20} className="mr-2" />
                  Save CV
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {aiShowFor && (
        <AISuggestions
          original={aiShowFor.original}
          enhanced={aiShowFor.enhanced}
          onApply={applyAISuggestion}
          onClose={() => setAiShowFor(null)}
        />
      )}

      {/* Advanced AI Enhancer */}
      {currentEnhancement && (
        <AIEnhancer
          title={currentEnhancement.title}
          fieldKey={currentEnhancement.fieldKey}
          originalContent={currentEnhancement.originalContent}
          onApply={applyAdvancedEnhancement}
          onClose={() => setCurrentEnhancement(null)}
          targetSchool={targetSchool}
        />
      )}

      {/* School Target Modal */}
      {showSchoolTargetModal && (
        <SchoolTargetModal
          onClose={() => setShowSchoolTargetModal(false)}
          onSave={setTargetSchool}
          currentTarget={targetSchool}
        />
      )}

      {/* AI Content Generator */}
      {showContentGenerator && (
        <AIContentGenerator
          onClose={() => setShowContentGenerator(false)}
          onApplyContent={applyGeneratedContent}
          targetSchool={targetSchool}
        />
      )}

      {/* Section Priority Guide */}
      {showSectionGuide && (
        <CVSectionGuide
          onClose={() => setShowSectionGuide(false)}
          onNavigateToSection={navigateToSection}
        />
      )}
    </div>
  );
};

export default CVEditor;
