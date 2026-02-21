import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useCV } from '../context/CVContext';
import { parseUploadedCV, extractTextFromPDF, extractTextFromDOCX } from '../services/openaiService';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { Upload, FileText, ArrowRight, Loader, AlertCircle, ArrowLeft } from 'lucide-react';

export default function UploadPage() {
    const navigate = useNavigate();
    const { setCvData, setCurrentStep, setIsProcessing } = useCV();
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);

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

        // Check Freemium Limit
        if (!user) {
            const currentTries = parseInt(localStorage.getItem('freeCvTries') || '0', 10);
            if (currentTries >= 3) {
                setShowAuthModal(true);
                return;
            }
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

            // Increment usage counter for guests on success
            if (!user) {
                const currentTries = parseInt(localStorage.getItem('freeCvTries') || '0', 10);
                localStorage.setItem('freeCvTries', (currentTries + 1).toString());
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
        if (!user) {
            const currentTries = parseInt(localStorage.getItem('freeCvTries') || '0', 10);
            if (currentTries >= 3) {
                setShowAuthModal(true);
                return;
            }
            localStorage.setItem('freeCvTries', (currentTries + 1).toString());
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
        </div>
    );
}
