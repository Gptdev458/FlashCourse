import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Course, CourseConfig, Lesson } from '../types/course';
import { CourseService } from '../services/courseService';

interface CourseContextType {
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  createCourse: (config: CourseConfig) => Promise<void>;
  confirmOutline: (courseId: string) => Promise<void>;
  getCurrentLesson: (lessonId: string) => Lesson | null;
  setCurrentCourse: (course: Course | null) => void;
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createCourse = useCallback(async (config: CourseConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const course = await CourseService.createCourse(config);
      setCurrentCourse(course);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmOutline = useCallback(async (courseId: string) => {
    if (!currentCourse || currentCourse.id !== courseId) {
      setError('Course not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedCourse = await CourseService.confirmOutline(courseId);
      setCurrentCourse(updatedCourse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate course content');
    } finally {
      setIsLoading(false);
    }
  }, [currentCourse]);

  const getCurrentLesson = useCallback((lessonId: string): Lesson | null => {
    if (!currentCourse) return null;
    return currentCourse.lessons.find(lesson => lesson.id === lessonId) || null;
  }, [currentCourse]);

  const value: CourseContextType = {
    currentCourse,
    isLoading,
    error,
    createCourse,
    confirmOutline,
    getCurrentLesson,
    setCurrentCourse,
    clearError
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
} 