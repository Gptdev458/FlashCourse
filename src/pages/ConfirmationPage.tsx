import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { currentCourse, confirmOutline, isLoading, error, clearError } = useCourse();
  
  const [backHovered, setBackHovered] = useState(false);
  const [confirmHovered, setConfirmHovered] = useState(false);
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 1rem'
    },
    navContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      height: '64px',
      display: 'flex',
      alignItems: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    main: {
      maxWidth: '768px',
      margin: '0 auto',
      padding: '64px 24px'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    },
    iconWrapper: {
      width: '64px',
      height: '64px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#6b7280'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      marginBottom: '32px'
    },
    cardHeader: {
      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
      padding: '32px',
      color: 'white'
    },
    courseTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    courseDescription: {
      color: '#dbeafe',
      lineHeight: '1.6'
    },
    cardBody: {
      padding: '32px'
    },
    outlineHeader: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      marginBottom: '16px'
    },
    lessonItem: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px',
      transition: 'background-color 0.2s',
      cursor: 'default'
    },
    lessonItemHover: {
      backgroundColor: '#f9fafb'
    },
    lessonNumber: {
      width: '32px',
      height: '32px',
      backgroundColor: '#dbeafe',
      color: '#2563eb',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500',
      marginRight: '12px',
      flexShrink: 0
    },
    lessonTitle: {
      color: '#374151',
      fontWeight: '500'
    },
    meta: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
      color: '#6b7280'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '24px',
      color: '#dc2626',
      fontSize: '14px',
      textAlign: 'center' as const
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center'
    },
    buttonBase: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '500',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    backButton: {
      backgroundColor: 'white',
      color: '#374151',
      border: '2px solid #e5e7eb'
    },
    backButtonHover: {
      borderColor: '#9ca3af'
    },
    backButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    confirmButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    confirmButtonHover: {
      backgroundColor: '#1d4ed8',
      transform: 'scale(1.02)'
    },
    confirmButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none'
    },
    confirmButtonLoading: {
      backgroundColor: '#6b7280'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    note: {
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '32px'
    }
  };

  // Redirect if no course or wrong status
  useEffect(() => {
    if (!currentCourse) {
      navigate('/');
      return;
    }
    if (currentCourse.status === 'completed') {
      navigate('/course');
      return;
    }
  }, [currentCourse, navigate]);

  // Navigate to course when lessons are generated
  useEffect(() => {
    if (currentCourse && currentCourse.status === 'completed') {
      navigate('/course');
    }
  }, [currentCourse, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleConfirm = async () => {
    if (!currentCourse) return;
    await confirmOutline(currentCourse.id);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Show loading or error state if no course data
  if (!currentCourse || !currentCourse.outline) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navContent}>
            <div style={styles.logo}>FlashCourse</div>
          </div>
        </nav>
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.title}>Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  const { outline } = currentCourse;
  const estimatedTime = outline.estimatedTime || '~45 minutes';
  const depthLabel = currentCourse.config.depth;
  const complexityLabel = currentCourse.config.complexity;

  const isButtonDisabled = isLoading;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>FlashCourse</div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h1 style={styles.title}>Your Course is Ready!</h1>
          <p style={styles.subtitle}>Review your personalized course outline below</p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Course Preview Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.courseTitle}>{outline.title}</h2>
            <p style={styles.courseDescription}>{outline.description}</p>
          </div>

          <div style={styles.cardBody}>
            <h3 style={styles.outlineHeader}>
              Course Outline • {outline.lessons.length} Lessons
            </h3>
            
            <div>
              {outline.lessons.map((lesson, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.lessonItem,
                    ...(hoveredLesson === index ? styles.lessonItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredLesson(index)}
                  onMouseLeave={() => setHoveredLesson(null)}
                >
                  <span style={styles.lessonNumber}>{index + 1}</span>
                  <span style={styles.lessonTitle}>{lesson}</span>
                </div>
              ))}
            </div>

            <div style={styles.meta}>
              <span>Estimated completion time: {estimatedTime}</span>
              <span>Difficulty: {depthLabel} • {complexityLabel}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={handleGoBack}
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            disabled={isButtonDisabled}
            style={{
              ...styles.buttonBase,
              ...styles.backButton,
              ...(backHovered && !isButtonDisabled ? styles.backButtonHover : {}),
              ...(isButtonDisabled ? styles.backButtonDisabled : {})
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Go Back
          </button>
          
          <button
            onClick={handleConfirm}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
            disabled={isButtonDisabled}
            style={{
              ...styles.buttonBase,
              ...styles.confirmButton,
              ...(confirmHovered && !isButtonDisabled ? styles.confirmButtonHover : {}),
              ...(isButtonDisabled ? styles.confirmButtonDisabled : {}),
              ...(isLoading ? styles.confirmButtonLoading : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.spinner}></div>
                Generating Course...
              </>
            ) : (
              <>
                Yes, Generate Course
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Info Note */}
        <p style={styles.note}>
          Once you confirm, we'll generate detailed content for each lesson. This may take a few moments.
        </p>
      </main>
    </div>
  );
}