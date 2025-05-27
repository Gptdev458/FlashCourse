import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import { PasswordProtection } from './components/PasswordProtection';
import HomePage from './pages/HomePage';
import ConfirmationPage from './pages/ConfirmationPage';
import LessonViewerPage from './pages/LessonViewerPage';

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    console.log('FlashCourse: App component mounted');
    try {
      // Check if we're in development or production
      console.log('Environment:', import.meta.env.MODE);
      console.log('Base URL:', import.meta.env.BASE_URL);
    } catch (error) {
      console.error('FlashCourse: Error in App useEffect:', error);
      setAppError((error as Error).message);
    }
  }, []);

  if (appError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: '#f9fafb'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>App Error</h1>
        <p style={{ color: '#6b7280', textAlign: 'center' }}>{appError}</p>
      </div>
    );
  }

  if (!hasAccess) {
    return <PasswordProtection onCorrectPassword={() => setHasAccess(true)} />;
  }

  try {
    return (
      <CourseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/course" element={<LessonViewerPage />} />
            <Route path="/lesson/:lessonId" element={<LessonViewerPage />} />
          </Routes>
        </Router>
      </CourseProvider>
    );
  } catch (error) {
    console.error('FlashCourse: Error rendering App:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: '#f9fafb'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Render Error</h1>
        <p style={{ color: '#6b7280', textAlign: 'center' }}>
          Failed to render the application: {(error as Error).message}
        </p>
      </div>
    );
  }
}

export default App;
