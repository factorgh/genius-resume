import { Experience, Education, PersonalInfo, Skill } from "../types/CV";
import OpenAI from 'openai';

export interface AISuggestionRequest {
  field: string;
  content?: string;
  context?: {
    programRequirements?: string;
    targetProgram?: string;
    userBackground?: string;
    jobDescription?: string;
    targetRole?: string;
    industry?: string;
  };
}

export interface AISuggestionResponse {
  original: string;
  enhanced: string;
  bulletPoints?: string[];
  explanation?: string;
}

export class AIService {
  private static openai: OpenAI | null = null;
  
  // Initialize the OpenAI client with API key
  public static initialize(apiKey: string): void {
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: apiKey || (import.meta.env.VITE_OPENAI_API_KEY as string),
        dangerouslyAllowBrowser: true // For client-side usage
      });
    }
  }

  // Check if API is initialized
  private static checkInitialization(): boolean {
    if (!this.openai) {
      // Try to initialize with env variable if available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
      if (apiKey) {
        this.initialize(apiKey);
        return !!this.openai;
      }
      return false;
    }
    return true;
  }

  public static async enhanceContent(request: AISuggestionRequest): Promise<AISuggestionResponse> {
    const { field, content = "", context = {} } = request;
    const originalContent = content;

    // If API is not initialized or in development mode without key, use fallback
    if (!this.checkInitialization()) {
      console.warn("OpenAI API not initialized. Using fallback enhancement.");
      return this.fallbackEnhancement(request);
    }

    try {
      // Create the appropriate prompt based on the type of content
      const prompt = this.createPrompt(field, content, context);
      
      // Make API call to OpenAI
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using a more cost-effective model, change to gpt-4 for better results
        messages: [
          {
            role: "system",
            content: `You are an expert CV/resume editor specializing in academic and professional documents. 
                     Your task is to enhance the given text to make it more impactful, clear, and professional.
                     Maintain the original meaning but improve the language, structure, and presentation.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      // Process the response
      const enhancedText = response.choices[0]?.message?.content || originalContent;
      
      // Extract bullet points if present
      const bulletPoints = this.extractBulletPoints(enhancedText);
      
      return {
        original: originalContent,
        enhanced: enhancedText,
        bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
        explanation: this.generateExplanation(originalContent, enhancedText)
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return {
        original: originalContent,
        enhanced: originalContent,
        explanation: "Sorry, there was an error processing your enhancement request. Please try again later."
      };
    }
  }

  private static createPrompt(field: string, content: string, context: any): string {
    switch (field) {
      case "summary":
        return `Enhance this professional summary for a CV or resume, making it more impactful and professional:
                
                "${content}"
                
                ${context.targetProgram ? `This is for an application to: ${context.targetProgram}` : ''}
                ${context.programRequirements ? `Program requirements: ${context.programRequirements}` : ''}
                
                Improve the language, add relevant keywords, and make it more achievement-focused. 
                Do not invent new qualifications, just enhance the existing content.
                Return the improved version only.`;
      
      case "education-description":
        return `Enhance this education description for a CV or resume:
                
                "${content}"
                
                ${context.targetProgram ? `This is for an application to: ${context.targetProgram}` : ''}
                
                Make it more focused on academic achievements, relevant coursework, and skills gained.
                Use professional academic language and highlight key accomplishments.
                Return the improved version only.`;
      
      case "experience-description":
        return `Enhance this work experience description for a CV or resume:
                
                "${content}"
                
                ${context.targetProgram ? `This is for an application to: ${context.targetProgram}` : ''}
                
                Improve it by:
                1. Using strong action verbs
                2. Making achievements more quantifiable if possible
                3. Focusing on relevant skills and accomplishments
                4. Creating clear and concise bullet points (if appropriate)
                
                Return the improved version only.`;
      
      case "generate-summary":
        return `Generate a professional summary for a CV in the field of ${context.targetProgram || 'academia'}.
                Focus on making it achievement-oriented, concise, and highlighting core competencies.
                Include relevant keywords for ${context.targetProgram || 'academic'} applications.`;
      
      case "generate-experience":
        return `Generate professional experience bullet points for a CV in the field of ${context.targetProgram || 'academia'}.
                Create 4-5 bullet points that showcase relevant skills, achievements, and responsibilities.
                Use strong action verbs and include quantifiable results where appropriate.`;
      
      case "generate-skills":
        return `Generate a list of 8-10 relevant skills for a CV in the field of ${context.targetProgram || 'academia'}.
                Format as a comma-separated list.
                Include both technical and soft skills appropriate for ${context.targetProgram || 'academic'} applications.`;
                
      default:
        return `Enhance the following content for a CV or resume, making it more professional, clear, and impactful:
                
                "${content}"
                
                Improve the language, structure, and presentation while maintaining the original meaning.
                Return the improved version only.`;
    }
  }

  private static extractBulletPoints(text: string): string[] {
    const bulletPointsRegex = /(?:^|\n)[•\-\*]\s*(.+)(?:\n|$)/g;
    const matches = [...text.matchAll(bulletPointsRegex)];
    
    if (matches.length > 0) {
      return matches.map(match => match[1].trim());
    }
    
    // If no bullet points found, try splitting by new lines
    if (text.includes('\n')) {
      return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
    
    return [];
  }

  private static generateExplanation(original: string, enhanced: string): string {
    // This would ideally be generated by another API call
    // For now, we're providing a simple generic explanation
    return "The AI enhancement improved grammar, clarity, and impact. It used stronger action verbs, more precise language, and better formatting to make your content more professional and compelling.";
  }

  // Fallback enhancement method when API is not available
  private static fallbackEnhancement(request: AISuggestionRequest): Promise<AISuggestionResponse> {
    const { field, content = "", context = {} } = request;
    
    // Basic enhancement rules for fallback
    let enhanced = content
      .replace(/worked on/gi, "spearheaded")
      .replace(/helped/gi, "facilitated")
      .replace(/made/gi, "developed")
      .replace(/did/gi, "executed")
      .replace(/good/gi, "excellent")
      .replace(/important/gi, "critical")
      .replace(/very/gi, "")
      .replace(/really/gi, "")
      .replace(/tried to/gi, "")
      .replace(/attempted to/gi, "");
    
    // Add some academic-focused enhancements
    if (context.targetProgram) {
      enhanced += enhanced.endsWith(".") ? " " : ". ";
      enhanced += `This experience directly aligns with the requirements for ${context.targetProgram}.`;
    }
    
    // Sample bullet points extraction
    const bulletPoints = enhanced
      .split(/\.\s+/)
      .filter(sentence => sentence.trim().length > 10 && !sentence.includes('aligns with'))
      .map(sentence => sentence.trim() + (sentence.endsWith(".") ? "" : "."));
    
    return Promise.resolve({
      original: content,
      enhanced,
      bulletPoints: bulletPoints.length > 1 ? bulletPoints : undefined,
      explanation: "Enhanced with stronger language and professional tone."
    });
  }
}
