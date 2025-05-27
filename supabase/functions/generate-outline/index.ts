import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types
interface CourseConfig {
  topic: string;
  depth: 'Intro' | 'Medium' | 'Expert';
  complexity: 'Simple' | 'Balanced' | 'Advanced';
}

interface CourseOutline {
  title: string;
  description: string;
  lessons: string[];
  estimatedTime: string;
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
const OUTLINE_SYSTEM_PROMPT = `You are an expert course planner and educational designer with deep knowledge across all subjects. Your task is to create comprehensive course outlines that are pedagogically sound, engaging, and appropriately structured for the target audience.

DEPTH GUIDELINES:
- Intro: Basic concepts, foundational knowledge, no prerequisites required. Focus on core understanding and practical basics.
- Medium: Intermediate concepts, some background helpful, practical applications. Balance theory with hands-on examples.
- Expert: Advanced concepts, significant prerequisites assumed, specialized knowledge. Deep dive into complex topics and expert-level applications.

COMPLEXITY GUIDELINES:
- Simple: Easy terminology, basic explanations, accessible examples, step-by-step approach
- Balanced: Standard terminology, moderate detail, balanced examples, structured progression
- Advanced: Technical terminology, complex explanations, sophisticated examples, assumes familiarity with concepts

LESSON COUNT: Generate 6-10 lessons that build logically upon each other, creating a coherent learning journey.

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON in the exact format specified
- No additional text, explanations, or formatting
- Ensure proper JSON syntax with correct quotes and commas

OUTPUT FORMAT:
{
  "title": "Engaging and specific course title",
  "description": "2-3 sentence course description explaining what learners will achieve",
  "lessons": ["Lesson 1 title", "Lesson 2 title", "Lesson 3 title", ...],
  "estimatedTime": "X hours" 
}

QUALITY STANDARDS:
- Lesson titles should be specific and actionable
- Ensure logical progression from fundamentals to advanced topics
- Include both theoretical understanding and practical application
- Make content relevant to real-world scenarios`;

function createOutlinePrompt(config: CourseConfig): string {
  return `Create a comprehensive course outline for the following specifications:

Topic: ${config.topic}
Depth Level: ${config.depth}
Complexity Level: ${config.complexity}

Ensure the course outline is appropriate for ${config.depth.toLowerCase()} level learners with ${config.complexity.toLowerCase()} complexity preferences. The course should provide a complete learning journey on ${config.topic}.`;
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
    const { topic, depth, complexity }: CourseConfig = await req.json();

    // Validate input
    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }

    if (!['Intro', 'Medium', 'Expert'].includes(depth)) {
      throw new Error('Invalid depth level');
    }

    if (!['Simple', 'Balanced', 'Advanced'].includes(complexity)) {
      throw new Error('Invalid complexity level');
    }

    // Initialize OpenAI client
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    const openAI = new OpenAIClient(apiKey);

    // Generate course outline
    const config: CourseConfig = { topic: topic.trim(), depth, complexity };
    const userPrompt = createOutlinePrompt(config);

    console.log('Generating outline for:', config);
    
    const response = await openAI.generateContent(
      OUTLINE_SYSTEM_PROMPT,
      userPrompt,
      0.7,
      1500
    );

    // Parse and validate response
    let outline: CourseOutline;
    try {
      outline = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid response format from AI');
    }

    // Validate outline structure
    if (!outline.title || !outline.description || !Array.isArray(outline.lessons) || outline.lessons.length < 6 || outline.lessons.length > 10) {
      throw new Error('Invalid outline structure');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store course in database
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: outline.title,
        description: outline.description,
        topic: config.topic,
        depth: config.depth,
        complexity: config.complexity,
        estimated_time: outline.estimatedTime,
        status: 'outline_generated'
      })
      .select()
      .single();

    if (courseError) {
      console.error('Database error:', courseError);
      throw new Error('Failed to save course');
    }

    // Store course outline
    const { error: outlineError } = await supabase
      .from('course_outlines')
      .insert({
        course_id: course.id,
        lessons: outline.lessons
      });

    if (outlineError) {
      console.error('Database error:', outlineError);
      throw new Error('Failed to save course outline');
    }

    console.log('Successfully created course:', course.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        courseId: course.id,
        outline: {
          title: outline.title,
          description: outline.description,
          lessons: outline.lessons,
          estimatedTime: outline.estimatedTime
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-outline:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Generation failed',
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