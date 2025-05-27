import { CourseConfig } from './types.ts';

export const OUTLINE_SYSTEM_PROMPT = `You are an expert course planner and educational designer with deep knowledge across all subjects. Your task is to create comprehensive course outlines that are pedagogically sound, engaging, and appropriately structured for the target audience.

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

export const LESSON_SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating engaging, comprehensive lesson content. Your task is to generate detailed lesson content that includes clear explanations, practical examples, and actionable takeaways.

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

export function createOutlinePrompt(config: CourseConfig): string {
  return `Create a comprehensive course outline for the following specifications:

Topic: ${config.topic}
Depth Level: ${config.depth}
Complexity Level: ${config.complexity}

Ensure the course outline is appropriate for ${config.depth.toLowerCase()} level learners with ${config.complexity.toLowerCase()} complexity preferences. The course should provide a complete learning journey on ${config.topic}.`;
}

export function createLessonPrompt(
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