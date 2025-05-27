import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import { PasswordProtection } from './components/PasswordProtection';
import HomePage from './pages/HomePage';
import ConfirmationPage from './pages/ConfirmationPage';
import LessonViewerPage from './pages/LessonViewerPage';

function App() {
  const [hasAccess, setHasAccess] = useState(false);

  if (!hasAccess) {
    return <PasswordProtection onCorrectPassword={() => setHasAccess(true)} />;
  }

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
}

export default App;
