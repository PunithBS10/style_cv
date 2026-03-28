import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CVProvider, useCV } from './context/CVContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import InputPage from './pages/InputPage';
import TemplatePage from './pages/TemplatePage';
import PreviewPage from './pages/PreviewPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CoverLetterLandingPage from './pages/CoverLetterLandingPage';
import CoverLetterPage from './pages/CoverLetterPage';
import { Sun, Moon, LogOut, User, Home } from 'lucide-react';

const steps = [
  { label: 'Info', path: '/' },
  { label: 'Details', path: '/input' },
  { label: 'Template', path: '/templates' },
  { label: 'Download', path: '/preview' },
];

const coverLetterSteps = [
  { label: 'Select CV', path: '/cover-letter-start' },
  { label: 'Generate', path: '/cover-letter' },
  { label: 'Download', path: '/cover-letter' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light'; // Default to dark unless explicitly set to 'light'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark(d => !d)}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

function ProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loader-spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, resetAll } = useCV();
  const { user, signOut } = useAuth();

  const isCoverLetterFlow = ['/cover-letter-start', '/cover-letter'].includes(location.pathname);

  const getStepStatus = (index) => {
    const pathMap = { '/': 0, '/upload': 0, '/input': 1, '/templates': 2, '/preview': 3 };
    const currentIndex = pathMap[location.pathname] ?? 0;
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return '';
  };

  const getCoverLetterStepStatus = (index) => {
    const currentIndex = location.pathname === '/cover-letter-start' ? 0 : 1;
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return '';
  };

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="navbar-brand" onClick={handleReset} style={{ gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 'bold' }}>
              <span style={{ color: '#3b82f6', fontSize: '1.8rem', fontStyle: 'italic', marginRight: '3px', fontFamily: 'serif' }}>Style</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '1.5rem', lineHeight: 1, fontWeight: 900 }}>
                CV
              </span>
            </div>
          </div>

          <button className="btn btn-ghost" onClick={() => navigate('/')} title="Home Page" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.6rem' }}>
            <Home size={16} />
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Home</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
          {user && (
            <div className="navbar-steps">
              {(isCoverLetterFlow ? coverLetterSteps : steps).map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <div className="navbar-step-line" />}
                  <div className={`navbar-step ${isCoverLetterFlow ? getCoverLetterStepStatus(i) : getStepStatus(i)}`}>
                    <div className="navbar-step-dot" />
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />

            {user ? (
              <button className="btn btn-ghost" onClick={() => navigate('/profile')} title="Profile Layout">
                <User size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ padding: '0.4rem 0.8rem' }}>
                <User size={14} /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          <Route path="/upload" element={<UploadPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/templates" element={<TemplatePage />} />
          <Route path="/preview" element={<PreviewPage />} />

          <Route path="/cover-letter-start" element={<CoverLetterLandingPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CVProvider>
          <AppRoutes />
        </CVProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
