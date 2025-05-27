# FlashCourse - AI-Powered Micro-Learning Platform

FlashCourse is an intelligent course generation platform that creates personalized educational content using AI. Simply enter a topic, choose your depth and complexity preferences, and get a custom-tailored course with detailed lessons in minutes.

## 🚀 Features

- **AI-Powered Course Generation**: Uses OpenAI GPT-3.5-turbo to create comprehensive course outlines and detailed lesson content
- **Password Protection**: Simple authentication with "hello" password for access control
- **Customizable Learning Paths**: 
  - **Depth Levels**: Intro, Medium, Expert
  - **Complexity Levels**: Simple, Balanced, Advanced
- **Real-Time Generation**: Watch your course being created in real-time
- **Professional UI**: Clean, modern interface built with React and Tailwind CSS
- **Persistent Sessions**: Stay logged in across browser sessions
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Supabase** for database and hosting
- **Supabase Edge Functions** for serverless AI processing
- **OpenAI API** for content generation
- **PostgreSQL** database with RLS policies

### AI Integration
- **OpenAI GPT-3.5-turbo** for course outline generation
- **OpenAI GPT-3.5-turbo** for detailed lesson content creation
- Custom prompts for educational content optimization
- Retry logic and error handling for reliable generation

## 📁 Project Structure

```
flashcourse-frontend/
├── src/
│   ├── components/
│   │   └── PasswordProtection.tsx    # Authentication component
│   ├── context/
│   │   └── CourseContext.tsx         # Global state management
│   ├── pages/
│   │   ├── HomePage.tsx              # Course creation form
│   │   ├── ConfirmationPage.tsx      # Course outline preview
│   │   └── LessonViewerPage.tsx      # Lesson display
│   ├── services/
│   │   ├── courseService.ts          # API integration
│   │   └── supabase.ts              # Supabase client
│   └── types/
│       └── course.ts                # TypeScript definitions
├── supabase/
│   └── functions/
│       ├── generate-outline/         # AI outline generation
│       ├── generate-lessons/         # AI lesson generation
│       └── shared/                   # Shared utilities
└── SETUP.md                         # Detailed setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Gptdev458/FlashCourse.git
cd FlashCourse
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://efhpjkefmgnjvpinruzj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaHBqa2VmbWduanZwaW5ydXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDU5MTIsImV4cCI6MjA2MzkyMTkxMn0.E1rBH0XQSX6ii8PIS_n0pcr981byfK9PCbXucrcORcc
```

4. **Supabase Setup**
- Go to [Supabase Dashboard](https://app.supabase.com/project/efhpjkefmgnjvpinruzj)
- Navigate to Settings > Edge Functions
- Add secret: `OPENAI_API_KEY` with your OpenAI API key

5. **Start Development Server**
```bash
npm run dev
```

6. **Access the Application**
- Open http://localhost:5173
- Enter password: `hello`
- Start creating courses!

## 🎯 How It Works

1. **Authentication**: Users enter the password "hello" to access the platform
2. **Course Creation**: Fill out the course creation form with:
   - Topic (e.g., "Machine Learning Basics")
   - Depth level (Intro/Medium/Expert)
   - Complexity (Simple/Balanced/Advanced)
3. **AI Generation**: The system uses OpenAI to:
   - Generate a comprehensive course outline (6-10 lessons)
   - Create detailed content for each lesson
4. **Course Delivery**: Users can navigate through lessons with rich content including:
   - Engaging introductions
   - Key concepts with explanations
   - Real-world examples
   - Summary takeaways

## 🔧 Configuration

### OpenAI Integration
The system uses GPT-3.5-turbo with custom prompts optimized for educational content:
- **System prompts** ensure pedagogically sound course structure
- **User prompts** incorporate learning preferences
- **Retry logic** handles API rate limits and errors

### Database Schema
- `courses`: Store course metadata and configuration
- `course_outlines`: Store lesson titles and structure
- `lessons`: Store detailed lesson content with structured fields

## 🛡 Security Features

- **Password Protection**: Simple but effective access control
- **Environment Variables**: Sensitive keys stored securely
- **RLS Policies**: Database-level security with Supabase
- **Input Validation**: Proper sanitization of user inputs

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📚 API Documentation

### Edge Functions

#### `/functions/v1/generate-outline`
Generates course outline from topic and preferences.

**Request:**
```json
{
  "topic": "Machine Learning Basics",
  "depth": "Intro",
  "complexity": "Simple"
}
```

**Response:**
```json
{
  "success": true,
  "courseId": "uuid",
  "outline": {
    "title": "Introduction to Machine Learning",
    "description": "Learn the fundamentals...",
    "lessons": ["Lesson 1", "Lesson 2", ...],
    "estimatedTime": "8 hours"
  }
}
```

#### `/functions/v1/generate-lessons`
Generates detailed lesson content for a course.

**Request:**
```json
{
  "courseId": "uuid"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For setup help or issues:
1. Check the [SETUP.md](SETUP.md) file
2. Review the troubleshooting section
3. Open an issue on GitHub

## 🎉 Acknowledgments

- OpenAI for providing the GPT-3.5-turbo API
- Supabase for the excellent backend-as-a-service platform
- React and Vite teams for the amazing development tools

---

**FlashCourse** - Learn Anything, Instantly! 🚀
