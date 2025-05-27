export interface CourseConfig {
  topic: string;
  depth: 'Intro' | 'Medium' | 'Expert';
  complexity: 'Simple' | 'Balanced' | 'Advanced';
}

export interface CourseOutline {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  estimatedTime?: string;
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

export interface Lesson {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  content: LessonContent;
}

export interface Course {
  id: string;
  config: CourseConfig;
  outline?: CourseOutline;
  lessons: Lesson[];
  status: 'pending' | 'outline_generated' | 'confirmed' | 'completed';
  createdAt: string;
} 