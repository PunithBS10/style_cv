import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useCV } from '../context/CVContext';
import { parseUploadedCV, extractTextFromPDF, extractTextFromDOCX } from '../services/openaiService';
import { useAuth } from '../context/AuthContext';
import { getUserResumes } from '../services/resumeService';
import AuthModal from '../components/AuthModal';
import { Upload, FileText, ArrowRight, Loader, AlertCircle, ArrowLeft, Clock, X, Sparkles } from 'lucide-react';

export default function UploadPage() {
    const navigate = useNavigate();
    const { setCvData, setCurrentStep, setIsProcessing } = useCV();
    const { user, isPremium } = useAuth();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [savedResumes, setSavedResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchResumes = async () => {
                setLoadingResumes(true);
                try {
                    const resumes = await getUserResumes(user.id);
                    setSavedResumes(resumes);
                } catch (err) {
                    console.error("Failed to load saved resumes:", err);
                } finally {
                    setLoadingResumes(false);
                }
            };
            fetchResumes();
        }
    }, [user]);

    const loadSavedResume = (resume) => {
        setCvData(resume.cv_data);
        setCurrentStep(1);
        navigate('/input');
    };

    const onDrop = useCallback((accepted, rejected) => {
        if (rejected.length > 0) {
            setError('Please upload a PDF or DOCX file under 10 MB.');
            return;
        }
        if (accepted.length > 0) {
            setFile(accepted[0]);
            setError('');
            setStatus('idle');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
    });

    const handleParse = async () => {
        if (!file) return;

        // Check Daily Limit (3 CVs per day for all users)
        const today = new Date().toLocaleDateString();
        const storedTries = JSON.parse(localStorage.getItem('dailyCvTries') || '{"count": 0, "date": ""}');

        if (storedTries.date !== today) {
            storedTries.date = today;
            storedTries.count = 0;
        }

        if (!isPremium && storedTries.count >= 3) {
            if (user) {
                setShowLimitModal(true);
            } else {
                setShowAuthModal(true);
            }
            return;
        }

        try {
            setStatus('parsing');
            setError('');
            setIsProcessing(true);

            setProgress(20);
            let text;
            if (file.name.toLowerCase().endsWith('.pdf')) {
                text = await extractTextFromPDF(file);
            } else {
                text = await extractTextFromDOCX(file);
            }

            if (!text || text.trim().length < 30) {
                throw new Error('Could not extract enough text. Try a different file or enter details manually.');
            }

            setProgress(55);
            const parsed = await parseUploadedCV(text);

            setProgress(100);
            setCvData(parsed);
            setStatus('done');
            setIsProcessing(false);

            // Increment daily usage counter for all users on success
            if (!isPremium) {
                const updatedTries = { date: today, count: storedTries.count + 1 };
                localStorage.setItem('dailyCvTries', JSON.stringify(updatedTries));
            }

            setTimeout(() => {
                setCurrentStep(1);
                navigate('/input');
            }, 500);
        } catch (err) {
            console.error('Parse error:', err);
            setError(err.message || 'Failed to parse your CV. Please try again or enter details manually.');
            setStatus('error');
            setIsProcessing(false);
        }
    };

    const skipToManual = () => {
        // Check Daily Limit
        const today = new Date().toLocaleDateString();
        const storedTries = JSON.parse(localStorage.getItem('dailyCvTries') || '{"count": 0, "date": ""}');

        if (storedTries.date !== today) {
            storedTries.date = today;
            storedTries.count = 0;
        }

        if (!isPremium && storedTries.count >= 3) {
            if (user) {
                setShowLimitModal(true);
            } else {
                setShowAuthModal(true);
            }
            return;
        }

        // Increment usage
        if (!isPremium) {
            const updatedTries = { date: today, count: storedTries.count + 1 };
            localStorage.setItem('dailyCvTries', JSON.stringify(updatedTries));
        }

        setCurrentStep(1);
        navigate('/input');
    };

    return (
        <div className="page-container" style={{ maxWidth: 560 }}>
            <h1 className="section-title">Upload your CV</h1>
            <p className="section-subtitle">
                Drop your resume below and our AI will extract everything automatically.
            </p>

            {user && savedResumes.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} /> Use a Saved Resume
                    </h3>
                    <select
                        className="form-input"
                        style={{ cursor: 'pointer', appearance: 'auto' }}
                        onChange={(e) => {
                            const r = savedResumes.find(x => x.id === e.target.value);
                            if (r) loadSavedResume(r);
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a saved resume...</option>
                        {savedResumes.map(resume => (
                            <option key={resume.id} value={resume.id}>
                                {resume.name} ({new Date(resume.created_at).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                    <div className="section-divider" style={{ margin: '1.5rem 0' }}>
                        <div className="section-divider-line" />
                        <span className="section-divider-label">OR</span>
                        <div className="section-divider-line" />
                    </div>
                </div>
            )}

            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} />
                {file ? (
                    <>
                        <div className="dropzone-icon"><FileText size={20} /></div>
                        <p className="dropzone-filename">{file.name}</p>
                        <p className="dropzone-text">
                            {(file.size / 1024).toFixed(1)} KB — click or drag to replace
                        </p>
                    </>
                ) : (
                    <>
                        <div className="dropzone-icon"><Upload size={20} /></div>
                        <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                            {isDragActive ? 'Drop your file here' : 'Drag & drop your CV here'}
                        </p>
                        <p className="dropzone-text">PDF or DOCX, up to 10 MB</p>
                    </>
                )}
            </div>

            {error && (
                <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {status === 'parsing' && (
                <div style={{ padding: '1rem 0' }}>
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                        <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {progress < 50 ? 'Extracting text...' : 'AI is parsing your CV...'}
                        </span>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                <button className="btn btn-ghost" onClick={() => navigate('/')}>
                    <ArrowLeft size={14} /> Back
                </button>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleParse}
                    disabled={!file || status === 'parsing'}
                >
                    {status === 'parsing' ? (
                        <>
                            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            Parsing...
                        </>
                    ) : (
                        <>Parse & continue <ArrowRight size={14} /></>
                    )}
                </button>
            </div>

            <p
                style={{
                    textAlign: 'right',
                    marginTop: '0.85rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                }}
                onClick={skipToManual}
            >
                Skip — I'll enter details manually
            </p>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                title="Free Limit Reached"
                message="You've used your 3 free CV creations! Create a free account to save your progress, unlock unlimited CVs, and access all AI tailoring features."
            />

            {/* DAILY LIMIT MODAL FOR USERS */}
            {showLimitModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem'
                }}>
                    <div className="card" style={{
                        maxWidth: 420,
                        width: '100%',
                        position: 'relative',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <button
                            onClick={() => setShowLimitModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.2rem'
                            }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'var(--accent-light)',
                                color: 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Sparkles size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Daily Limit Reached</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                You have used all 3 of your daily CV creations. Need more? Upgrade to Premium for unlimited AI parsing, saving, and tailoring.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexDirection: 'column' }}>
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => {
                                    setShowLimitModal(false);
                                    navigate('/profile#premium');
                                }}
                            >
                                <Sparkles size={16} /> View Premium Options
                            </button>
                            <button
                                className="btn btn-ghost"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => setShowLimitModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
