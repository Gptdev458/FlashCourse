// Shared types for Supabase Edge Functions
export interface CourseConfig {
  topic: string;
  depth: 'Intro' | 'Medium' | 'Expert';
  complexity: 'Simple' | 'Balanced' | 'Advanced';
}

export interface CourseOutline {
  title: string;
  description: string;
  lessons: string[];
  estimatedTime: string;
}

export interface LessonContent {
  introduction: string;
  keyConceptsTitle: string;
  keyConcepts: string[];
  exampleTitle: string;
  exampleContent: string;
  summaryTitle: string;
  summaryContent: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface APIError {
  error: string;
  message?: string;
} 