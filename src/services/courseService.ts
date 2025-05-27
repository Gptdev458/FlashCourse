import { supabase } from './supabase';
import type { CourseConfig, Course, Lesson } from '../types/course';

export class CourseService {
  // Create a new course with initial configuration
  static async createCourse(config: CourseConfig): Promise<Course> {
    try {
      // Call the generate-outline Edge Function
      const response = await supabase.functions.invoke('generate-outline', {
        body: {
          topic: config.topic,
          depth: config.depth,
          complexity: config.complexity
        }
      });

      if (response.error) {
        console.error('Edge Function error:', response.error);
        throw new Error(response.error.message || 'Failed to generate course outline');
      }

      const { courseId, outline } = response.data;

      if (!courseId || !outline) {
        throw new Error('Invalid response from outline generation');
      }

      return {
        id: courseId,
        config,
        outline: {
          id: courseId,
          title: outline.title,
          description: outline.description,
          lessons: outline.lessons,
          estimatedTime: outline.estimatedTime
        },
        lessons: [],
        status: 'outline_generated',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  }

  // Confirm course outline and generate lessons
  static async confirmOutline(courseId: string): Promise<Course> {
    try {
      // Call the generate-lessons Edge Function
      const response = await supabase.functions.invoke('generate-lessons', {
        body: { courseId }
      });

      if (response.error) {
        console.error('Edge Function error:', response.error);
        throw new Error(response.error.message || 'Failed to generate lessons');
      }

      // Get the updated course data
      return await this.getCourse(courseId) || (() => {
        throw new Error('Course not found after lesson generation');
      })();
    } catch (error) {
      console.error('Error confirming outline:', error);
      throw new Error('Failed to generate course content');
    }
  }

  // Get course by ID with lessons
  static async getCourse(courseId: string): Promise<Course | null> {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          course_outlines (*),
          lessons (*)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      const lessons: Lesson[] = courseData.lessons
        .sort((a: any, b: any) => a.lesson_number - b.lesson_number)
        .map((lesson: any) => ({
          id: lesson.id,
          courseId: lesson.course_id,
          lessonNumber: lesson.lesson_number,
          title: lesson.title,
          content: {
            introduction: lesson.introduction || '',
            keyConceptsTitle: lesson.key_concepts_title || 'Key Concepts',
            keyConcepts: lesson.key_concepts || [],
            exampleTitle: lesson.example_title || 'Real-World Example',
            exampleContent: lesson.example_content || '',
            summaryTitle: lesson.summary_title || 'Key Takeaways',
            summaryContent: lesson.summary_content || ''
          }
        }));

      const outline = courseData.course_outlines?.[0];

      return {
        id: courseData.id,
        config: {
          topic: courseData.topic,
          depth: courseData.depth as 'Intro' | 'Medium' | 'Expert',
          complexity: courseData.complexity as 'Simple' | 'Balanced' | 'Advanced'
        },
        outline: outline ? {
          id: outline.id,
          title: courseData.title,
          description: courseData.description || '',
          lessons: outline.lessons,
          estimatedTime: courseData.estimated_time || ''
        } : undefined,
        lessons,
        status: courseData.status as 'pending' | 'outline_generated' | 'confirmed' | 'completed',
        createdAt: courseData.created_at
      };
    } catch (error) {
      console.error('Error getting course:', error);
      return null;
    }
  }

  // Get lesson by ID
  static async getLesson(lessonId: string): Promise<Lesson | null> {
    try {
      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      return {
        id: lessonData.id,
        courseId: lessonData.course_id,
        lessonNumber: lessonData.lesson_number,
        title: lessonData.title,
        content: {
          introduction: lessonData.introduction || '',
          keyConceptsTitle: lessonData.key_concepts_title || 'Key Concepts',
          keyConcepts: lessonData.key_concepts || [],
          exampleTitle: lessonData.example_title || 'Real-World Example',
          exampleContent: lessonData.example_content || '',
          summaryTitle: lessonData.summary_title || 'Key Takeaways',
          summaryContent: lessonData.summary_content || ''
        }
      };
    } catch (error) {
      console.error('Error getting lesson:', error);
      return null;
    }
  }

  // Get lessons for a course
  static async getLessons(courseId: string): Promise<Lesson[]> {
    try {
      const { data: lessonsData, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_number', { ascending: true });

      if (error) throw error;

      return lessonsData.map((lesson: any) => ({
        id: lesson.id,
        courseId: lesson.course_id,
        lessonNumber: lesson.lesson_number,
        title: lesson.title,
        content: {
          introduction: lesson.introduction || '',
          keyConceptsTitle: lesson.key_concepts_title || 'Key Concepts',
          keyConcepts: lesson.key_concepts || [],
          exampleTitle: lesson.example_title || 'Real-World Example',
          exampleContent: lesson.example_content || '',
          summaryTitle: lesson.summary_title || 'Key Takeaways',
          summaryContent: lesson.summary_content || ''
        }
      }));
    } catch (error) {
      console.error('Error getting lessons:', error);
      return [];
    }
  }

  // Check course generation status
  static async getCourseStatus(courseId: string): Promise<'pending' | 'outline_generated' | 'confirmed' | 'completed' | null> {
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('status')
        .eq('id', courseId)
        .single();

      if (error) throw error;

      return courseData.status as 'pending' | 'outline_generated' | 'confirmed' | 'completed';
    } catch (error) {
      console.error('Error getting course status:', error);
      return null;
    }
  }
} 