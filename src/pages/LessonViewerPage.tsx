import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';

export default function LessonViewerPage() {
  const navigate = useNavigate();
  const { currentCourse } = useCourse();
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky' as const,
      top: 0,
      zIndex: 40
    },
    navContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    menuButton: {
      display: 'none',
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer'
    },
    menuButtonMobile: {
      display: 'block'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    navMeta: {
      fontSize: '14px',
      color: '#6b7280'
    },
    layout: {
      display: 'flex',
      height: 'calc(100vh - 64px)'
    },
    sidebar: {
      width: '320px',
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto' as const,
      transition: 'transform 0.3s ease-in-out'
    },
    sidebarMobile: {
      position: 'fixed' as const,
      top: '64px',
      left: 0,
      bottom: 0,
      zIndex: 30,
      transform: 'translateX(-100%)'
    },
    sidebarOpen: {
      transform: 'translateX(0)'
    },
    sidebarContent: {
      padding: '24px'
    },
    sidebarHeader: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeButton: {
      display: 'none',
      padding: '4px',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer'
    },
    closeButtonMobile: {
      display: 'block'
    },
    lessonNav: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    lessonItem: {
      width: '100%',
      textAlign: 'left' as const,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      transition: 'all 0.2s'
    },
    lessonItemHover: {
      backgroundColor: '#e5e7eb'
    },
    lessonItemActive: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    lessonIcon: {
      flexShrink: 0,
      marginTop: '2px'
    },
    lessonText: {
      fontSize: '14px',
      fontWeight: '500'
    },
    mainContent: {
      flex: 1,
      overflowY: 'auto' as const
    },
    article: {
      maxWidth: '896px',
      margin: '0 auto',
      padding: '32px 32px 64px'
    },
    lessonHeader: {
      marginBottom: '32px',
      paddingBottom: '32px',
      borderBottom: '2px solid #e5e7eb'
    },
    lessonMeta: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '8px'
    },
    lessonTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.75',
      color: '#4b5563'
    },
    conceptList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    conceptItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    bullet: {
      width: '8px',
      height: '8px',
      backgroundColor: '#2563eb',
      borderRadius: '50%',
      marginTop: '8px',
      marginRight: '12px',
      flexShrink: 0
    },
    exampleBox: {
      backgroundColor: '#eff6ff',
      borderLeft: '4px solid #2563eb',
      padding: '24px',
      borderRadius: '0 8px 8px 0'
    },
    exampleTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '12px'
    },
    summaryBox: {
      backgroundColor: '#f9fafb',
      padding: '24px',
      borderRadius: '8px'
    },
    summaryTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    progressSection: {
      marginTop: '48px'
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      transition: 'width 0.5s ease-out'
    },
    progressText: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px',
      textAlign: 'center' as const
    },
    navButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '48px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      color: '#4b5563',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    navButtonHover: {
      borderColor: '#2563eb',
      color: '#2563eb'
    },
    navButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    nextButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none'
    },
    nextButtonHover: {
      backgroundColor: '#1d4ed8'
    },
    overlay: {
      display: 'none',
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 20
    },
    overlayMobile: {
      display: 'block'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#6b7280'
    }
  };

  // Redirect if no course
  useEffect(() => {
    if (!currentCourse || !currentCourse.lessons.length) {
      navigate('/');
    }
  }, [currentCourse, navigate]);

  // Initialize completed lessons (mark all before current as completed)
  useEffect(() => {
    if (currentCourse && currentCourse.lessons.length > 0) {
      const completed = [];
      for (let i = 0; i < currentLessonIndex; i++) {
        completed.push(i + 1);
      }
      setCompletedLessons(completed);
    }
  }, [currentLessonIndex, currentCourse]);

  if (!currentCourse || !currentCourse.lessons.length) {
    return (
      <div style={styles.loading}>
        Loading course...
      </div>
    );
  }

  const lessons = currentCourse.lessons;
  const currentLesson = lessons[currentLessonIndex];
  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  // Responsive logic
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleLessonClick = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex);
    setSidebarOpen(false);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCompletedLessons([...completedLessons, currentLessonIndex + 1]);
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                ...styles.menuButton,
                ...(isMobile ? styles.menuButtonMobile : {})
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div style={styles.logo}>FlashCourse</div>
          </div>
          <div style={styles.navMeta}>
            {currentCourse.outline?.title} • {completedLessons.length} of {lessons.length} completed
          </div>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={{
          ...styles.sidebar,
          ...(isMobile ? styles.sidebarMobile : {}),
          ...(sidebarOpen && isMobile ? styles.sidebarOpen : {})
        }}>
          <div style={styles.sidebarContent}>
            <div style={styles.sidebarHeader}>
              Table of Contents
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  ...styles.closeButton,
                  ...(isMobile ? styles.closeButtonMobile : {})
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <nav style={styles.lessonNav}>
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(index + 1);
                const isCurrent = index === currentLessonIndex;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(index)}
                    onMouseEnter={() => setHoveredLesson(index)}
                    onMouseLeave={() => setHoveredLesson(null)}
                    style={{
                      ...styles.lessonItem,
                      ...(hoveredLesson === index && !isCurrent ? styles.lessonItemHover : {}),
                      ...(isCurrent ? styles.lessonItemActive : {})
                    }}
                  >
                    <span style={styles.lessonIcon}>
                      {isCompleted ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? 'white' : '#10b981'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? 'white' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      )}
                    </span>
                    <span style={styles.lessonText}>
                      {index + 1}. {lesson.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            style={{
              ...styles.overlay,
              ...(isMobile ? styles.overlayMobile : {})
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main style={styles.mainContent}>
          <article style={styles.article}>
            {/* Lesson Header */}
            <header style={styles.lessonHeader}>
              <div style={styles.lessonMeta}>
                LESSON {currentLessonIndex + 1} OF {lessons.length}
              </div>
              <h1 style={styles.lessonTitle}>
                {currentLesson.title}
              </h1>
            </header>

            {/* Lesson Content */}
            {currentLesson.content.introduction && (
              <section style={styles.section}>
                <p style={styles.paragraph}>
                  {currentLesson.content.introduction}
                </p>
              </section>
            )}

            {currentLesson.content.keyConcepts.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  {currentLesson.content.keyConceptsTitle}
                </h2>
                <ul style={styles.conceptList}>
                  {currentLesson.content.keyConcepts.map((concept, index) => (
                    <li key={index} style={styles.conceptItem}>
                      <span style={styles.bullet} />
                      <span style={styles.paragraph}>{concept}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {currentLesson.content.exampleContent && (
              <section style={styles.section}>
                <div style={styles.exampleBox}>
                  <h3 style={styles.exampleTitle}>
                    {currentLesson.content.exampleTitle}
                  </h3>
                  <p style={styles.paragraph}>
                    {currentLesson.content.exampleContent}
                  </p>
                </div>
              </section>
            )}

            {currentLesson.content.summaryContent && (
              <section style={styles.section}>
                <div style={styles.summaryBox}>
                  <h3 style={styles.summaryTitle}>
                    {currentLesson.content.summaryTitle}
                  </h3>
                  <p style={styles.paragraph}>
                    {currentLesson.content.summaryContent}
                  </p>
                </div>
              </section>
            )}

            {/* Progress Bar */}
            <div style={styles.progressSection}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${progressPercentage}%`
                  }}
                />
              </div>
              <p style={styles.progressText}>
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>

            {/* Navigation Buttons */}
            <nav style={styles.navButtons}>
              <button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                onMouseEnter={() => setPrevHovered(true)}
                onMouseLeave={() => setPrevHovered(false)}
                style={{
                  ...styles.navButton,
                  ...(prevHovered && currentLessonIndex !== 0 ? styles.navButtonHover : {}),
                  ...(currentLessonIndex === 0 ? styles.navButtonDisabled : {})
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous Lesson
              </button>
              
              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === lessons.length - 1}
                onMouseEnter={() => setNextHovered(true)}
                onMouseLeave={() => setNextHovered(false)}
                style={{
                  ...styles.navButton,
                  ...styles.nextButton,
                  ...(nextHovered && currentLessonIndex !== lessons.length - 1 ? styles.nextButtonHover : {}),
                  ...(currentLessonIndex === lessons.length - 1 ? styles.navButtonDisabled : {})
                }}
              >
                {currentLessonIndex === lessons.length - 1 ? 'Course Complete!' : 'Next Lesson'}
                {currentLessonIndex < lessons.length - 1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </button>
            </nav>
          </article>
        </main>
      </div>
    </div>
  );
}