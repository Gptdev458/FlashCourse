import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types
interface CourseConfig {
  topic: string;
  depth: 'Intro' | 'Medium' | 'Expert';
  complexity: 'Simple' | 'Balanced' | 'Advanced';
}

interface LessonContent {
  introduction: string;
  keyConceptsTitle: string;
  keyConcepts: string[];
  exampleTitle: string;
  exampleContent: string;
  summaryTitle: string;
  summaryContent: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// OpenAI Client
class OpenAIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return content;
  }
}

// Prompts
const LESSON_SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating engaging, comprehensive lesson content. Your task is to generate detailed lesson content that includes clear explanations, practical examples, and actionable takeaways.

CONTENT STRUCTURE REQUIREMENTS:
1. Introduction: Engaging opening that explains the lesson's importance and what learners will achieve
2. Key Concepts: 3-5 main points with clear, detailed explanations
3. Real-World Example: Practical application, case study, or detailed scenario
4. Summary: Key takeaways and how this connects to the broader course

WRITING GUIDELINES:
- Use clear, accessible language appropriate to the complexity level
- Include specific details and actionable information
- Make content engaging with relevant examples
- Ensure consistency with the overall course depth and complexity
- Write in second person ("you will learn", "you can apply")

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON in the exact format specified
- No additional text, explanations, or formatting
- Ensure proper JSON syntax with correct quotes and commas

OUTPUT FORMAT:
{
  "introduction": "Engaging introduction paragraph explaining the lesson's importance and objectives",
  "keyConceptsTitle": "Key Concepts",
  "keyConcepts": [
    "Detailed explanation of concept 1 with specific examples",
    "Detailed explanation of concept 2 with practical applications",
    "Detailed explanation of concept 3 with real-world context"
  ],
  "exampleTitle": "Real-World Example",
  "exampleContent": "Detailed example, case study, or practical scenario with specific details and outcomes",
  "summaryTitle": "Key Takeaways",
  "summaryContent": "Summary paragraph highlighting main points and connecting to broader course objectives"
}`;

function createLessonPrompt(
  config: CourseConfig,
  lessonTitle: string,
  lessonNumber: number,
  totalLessons: number,
  courseTitle: string,
  previousLessons: string[]
): string {
  const context = previousLessons.length > 0 
    ? `Previous lessons covered: ${previousLessons.join(', ')}.`
    : 'This is the first lesson in the course.';

  return `Create detailed lesson content for:

Course: ${courseTitle}
Lesson ${lessonNumber} of ${totalLessons}: ${lessonTitle}
Topic: ${config.topic}
Depth Level: ${config.depth}
Complexity Level: ${config.complexity}

Context: ${context}

Ensure this lesson:
- Builds appropriately on previous content
- Maintains consistency with the ${config.depth.toLowerCase()} depth level
- Uses ${config.complexity.toLowerCase()} complexity language and concepts
- Provides practical, actionable learning
- Connects to the overall ${config.topic} learning objectives`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { courseId }: { courseId: string } = await req.json();

    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get course and outline data
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        course_outlines (*)
      `)
      .eq('id', courseId)
      .single();

    if (courseError || !courseData) {
      throw new Error('Course not found');
    }

    if (!courseData.course_outlines?.[0]) {
      throw new Error('Course outline not found');
    }

    const outline = courseData.course_outlines[0];
    const lessonTitles: string[] = outline.lessons;

    if (!Array.isArray(lessonTitles) || lessonTitles.length === 0) {
      throw new Error('No lessons found in course outline');
    }

    // Update course status to indicate lesson generation in progress
    await supabase
      .from('courses')
      .update({ status: 'confirmed' })
      .eq('id', courseId);

    console.log(`Generating ${lessonTitles.length} lessons for course:`, courseId);

    // Initialize OpenAI client
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    const openAI = new OpenAIClient(apiKey);

    const config: CourseConfig = {
      topic: courseData.topic,
      depth: courseData.depth as 'Intro' | 'Medium' | 'Expert',
      complexity: courseData.complexity as 'Simple' | 'Balanced' | 'Advanced'
    };

    // Generate content for each lesson
    const lessons = [];
    const previousLessons: string[] = [];

    for (let i = 0; i < lessonTitles.length; i++) {
      const lessonTitle = lessonTitles[i];
      console.log(`Generating lesson ${i + 1}/${lessonTitles.length}: ${lessonTitle}`);

      try {
        const userPrompt = createLessonPrompt(
          config,
          lessonTitle,
          i + 1,
          lessonTitles.length,
          courseData.title,
          previousLessons
        );

        const response = await openAI.generateContent(
          LESSON_SYSTEM_PROMPT,
          userPrompt,
          0.7,
          2500
        );

        // Parse and validate lesson content
        let lessonContent: LessonContent;
        try {
          lessonContent = JSON.parse(response);
        } catch (parseError) {
          console.error(`Failed to parse lesson ${i + 1} response:`, response);
          throw new Error(`Invalid response format for lesson ${i + 1}`);
        }

        // Validate lesson content structure
        if (!lessonContent.introduction || !lessonContent.keyConcepts || !Array.isArray(lessonContent.keyConcepts)) {
          throw new Error(`Invalid lesson content structure for lesson ${i + 1}`);
        }

        lessons.push({
          course_id: courseId,
          lesson_number: i + 1,
          title: lessonTitle,
          introduction: lessonContent.introduction,
          key_concepts_title: lessonContent.keyConceptsTitle || 'Key Concepts',
          key_concepts: lessonContent.keyConcepts,
          example_title: lessonContent.exampleTitle || 'Real-World Example',
          example_content: lessonContent.exampleContent,
          summary_title: lessonContent.summaryTitle || 'Key Takeaways',
          summary_content: lessonContent.summaryContent
        });

        previousLessons.push(lessonTitle);

        // Add a small delay between requests to avoid rate limiting
        if (i < lessonTitles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (lessonError) {
        console.error(`Error generating lesson ${i + 1}:`, lessonError);
        // Continue with other lessons rather than failing completely
        lessons.push({
          course_id: courseId,
          lesson_number: i + 1,
          title: lessonTitle,
          introduction: `This lesson covers ${lessonTitle.toLowerCase()}. Content generation failed, but the lesson framework is preserved.`,
          key_concepts_title: 'Key Concepts',
          key_concepts: ['Concept generation failed - please regenerate this lesson'],
          example_title: 'Real-World Example',
          example_content: 'Example content generation failed - please regenerate this lesson.',
          summary_title: 'Key Takeaways',
          summary_content: 'Summary generation failed - please regenerate this lesson.'
        });
      }
    }

    // Insert all lessons into database
    const { error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessons);

    if (lessonsError) {
      console.error('Database error inserting lessons:', lessonsError);
      throw new Error('Failed to save lessons');
    }

    // Update course status to completed
    const { error: updateError } = await supabase
      .from('courses')
      .update({ status: 'completed' })
      .eq('id', courseId);

    if (updateError) {
      console.error('Database error updating course status:', updateError);
      // Don't throw here as lessons were saved successfully
    }

    console.log(`Successfully generated ${lessons.length} lessons for course:`, courseId);

    return new Response(
      JSON.stringify({ 
        success: true,
        courseId,
        lessonsGenerated: lessons.length,
        message: 'Lessons generated successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-lessons:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Lesson generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    );
  }
}); 