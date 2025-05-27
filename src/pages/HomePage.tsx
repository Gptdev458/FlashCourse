import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import type { CourseConfig } from '../types/course';

export default function HomePage() {
  const navigate = useNavigate();
  const { createCourse, isLoading, error, clearError, currentCourse } = useCourse();
  
  const [config, setConfig] = useState<CourseConfig>({
    topic: '',
    depth: 'Medium',
    complexity: 'Balanced'
  });

  // Navigate to confirmation page when course is created
  useEffect(() => {
    if (currentCourse && currentCourse.status === 'outline_generated') {
      navigate('/confirmation');
    }
  }, [currentCourse, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async () => {
    if (!config.topic.trim()) {
      alert('Please enter a topic to learn about');
      return;
    }
    await createCourse(config);
  };

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
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    main: {
      maxWidth: '672px',
      margin: '0 auto',
      padding: '64px 24px'
    },
    heroSection: {
      textAlign: 'center' as const,
      marginBottom: '48px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '20px',
      color: '#6b7280'
    },
    form: {
      marginBottom: '64px'
    },
    formGroup: {
      marginBottom: '32px'
    },
    label: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      transition: 'all 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#2563eb',
      backgroundColor: 'white'
    },
    inputDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    selectGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '40px'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s'
    },
    selectDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: '500',
      color: 'white',
      backgroundColor: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      gap: '8px'
    },
    buttonHover: {
      backgroundColor: '#1d4ed8',
      transform: 'scale(1.02)'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none'
    },
    buttonLoading: {
      backgroundColor: '#6b7280'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '24px',
      color: '#dc2626',
      fontSize: '14px'
    },
    examples: {
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#6b7280'
    },
    exampleList: {
      marginTop: '16px',
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '12px'
    },
    exampleTag: {
      padding: '4px 12px',
      backgroundColor: '#f3f4f6',
      borderRadius: '9999px',
      color: '#4b5563',
      fontSize: '14px'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const [inputFocused, setInputFocused] = useState(false);
  const [selectDepthFocused, setSelectDepthFocused] = useState(false);
  const [selectComplexityFocused, setSelectComplexityFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const isButtonDisabled = isLoading || !config.topic.trim();

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
        <div style={styles.heroSection}>
          <h1 style={styles.title}>Learn Anything, Instantly</h1>
          <p style={styles.subtitle}>Create a custom mini-course tailored to your needs</p>
        </div>

        <div style={styles.form}>
          {/* Error Display */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* Topic Input */}
          <div style={styles.formGroup}>
            <label htmlFor="topic" style={styles.label}>
              What do you want to learn?
            </label>
            <input
              type="text"
              id="topic"
              value={config.topic}
              onChange={(e) => setConfig({ ...config, topic: e.target.value })}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="e.g., Basics of UX design, REST APIs, Urban Planning..."
              disabled={isLoading}
              style={{
                ...styles.input,
                ...(inputFocused ? styles.inputFocus : {}),
                ...(isLoading ? styles.inputDisabled : {})
              }}
            />
          </div>

          {/* Depth and Complexity Selectors */}
          <div style={styles.selectGrid}>
            <div>
              <label htmlFor="depth" style={styles.label}>
                How deep should we go?
              </label>
              <select
                id="depth"
                value={config.depth}
                onChange={(e) => setConfig({ ...config, depth: e.target.value as CourseConfig['depth'] })}
                onFocus={() => setSelectDepthFocused(true)}
                onBlur={() => setSelectDepthFocused(false)}
                disabled={isLoading}
                style={{
                  ...styles.select,
                  ...(selectDepthFocused ? styles.inputFocus : {}),
                  ...(isLoading ? styles.selectDisabled : {})
                }}
              >
                <option value="Intro">Intro</option>
                <option value="Medium">Medium</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label htmlFor="complexity" style={styles.label}>
                How complex should it be?
              </label>
              <select
                id="complexity"
                value={config.complexity}
                onChange={(e) => setConfig({ ...config, complexity: e.target.value as CourseConfig['complexity'] })}
                onFocus={() => setSelectComplexityFocused(true)}
                onBlur={() => setSelectComplexityFocused(false)}
                disabled={isLoading}
                style={{
                  ...styles.select,
                  ...(selectComplexityFocused ? styles.inputFocus : {}),
                  ...(isLoading ? styles.selectDisabled : {})
                }}
              >
                <option value="Simple">Simple</option>
                <option value="Balanced">Balanced</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            disabled={isButtonDisabled}
            style={{
              ...styles.button,
              ...(buttonHovered && !isButtonDisabled ? styles.buttonHover : {}),
              ...(isButtonDisabled ? styles.buttonDisabled : {}),
              ...(isLoading ? styles.buttonLoading : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.spinner}></div>
                Generating Course...
              </>
            ) : (
              <>
                Generate My Course
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Examples Section */}
        <div style={styles.examples}>
          <p>Join thousands of learners who've created custom courses on topics like:</p>
          <div style={styles.exampleList}>
            {['Machine Learning Basics', 'Project Management', 'Photography 101', 'Blockchain Explained'].map((example) => (
              <span key={example} style={styles.exampleTag}>
                {example}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}