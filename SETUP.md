# FlashCourse Setup Instructions

## Environment Variables

Create a `.env` file in the `flashcourse-frontend` directory with the following:

```
VITE_SUPABASE_URL=https://efhpjkefmgnjvpinruzj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaHBqa2VmbWduanZwaW5ydXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDU5MTIsImV4cCI6MjA2MzkyMTkxMn0.E1rBH0XQSX6ii8PIS_n0pcr981byfK9PCbXucrcORcc
```

## OpenAI API Key Setup

1. Go to the Supabase Dashboard: https://app.supabase.com/project/efhpjkefmgnjvpinruzj
2. Navigate to Settings > Edge Functions
3. Add a new secret:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

## Database Schema

The database schema is already configured with:
- `courses` table with proper constraints
- `lessons` table with structured content fields  
- `course_outlines` table with JSONB lesson arrays

## Deployed Edge Functions

1. **generate-outline**: Creates AI-generated course outlines
2. **generate-lessons**: Generates detailed lesson content

## Running the Application

```bash
cd flashcourse-frontend
npm install
npm run dev
```

## AI Logic Status

✅ **COMPLETED:**
- Supabase project setup and database schema
- Edge Functions for outline and lesson generation
- OpenAI integration with GPT-3.5-turbo
- Frontend service layer updated to use real AI functions
- Proper error handling and progress tracking

🔧 **NEEDS SETUP:**
- OpenAI API key in Supabase secrets
- Frontend environment variables

The AI logic is fully implemented and ready to generate real educational content! 