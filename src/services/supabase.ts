import { createClient } from '@supabase/supabase-js';

// Add environment validation with detailed logging
console.log('FlashCourse: Checking environment variables...');
console.log('VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables';
  console.error('FlashCourse Error:', error);
  console.error('Available env vars:', Object.keys(import.meta.env));
  throw new Error(error);
}

console.log('FlashCourse: Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('FlashCourse: Supabase client created successfully');

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          topic: string;
          depth: 'Intro' | 'Medium' | 'Deep';
          complexity: 'Simple' | 'Balanced' | 'Advanced';
          estimated_time: string | null;
          status: 'pending' | 'outline_generated' | 'confirmed' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          topic: string;
          depth: 'Intro' | 'Medium' | 'Deep';
          complexity: 'Simple' | 'Balanced' | 'Advanced';
          estimated_time?: string | null;
          status?: 'pending' | 'outline_generated' | 'confirmed' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          topic?: string;
          depth?: 'Intro' | 'Medium' | 'Deep';
          complexity?: 'Simple' | 'Balanced' | 'Advanced';
          estimated_time?: string | null;
          status?: 'pending' | 'outline_generated' | 'confirmed' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          lesson_number: number;
          title: string;
          introduction: string | null;
          key_concepts_title: string | null;
          key_concepts: string[] | null;
          example_title: string | null;
          example_content: string | null;
          summary_title: string | null;
          summary_content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          lesson_number: number;
          title: string;
          introduction?: string | null;
          key_concepts_title?: string | null;
          key_concepts?: string[] | null;
          example_title?: string | null;
          example_content?: string | null;
          summary_title?: string | null;
          summary_content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          lesson_number?: number;
          title?: string;
          introduction?: string | null;
          key_concepts_title?: string | null;
          key_concepts?: string[] | null;
          example_title?: string | null;
          example_content?: string | null;
          summary_title?: string | null;
          summary_content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      course_outlines: {
        Row: {
          id: string;
          course_id: string;
          lessons: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          lessons: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          lessons?: string[];
          created_at?: string;
        };
      };
    };
  };
} 