import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { getUserResumes } from '../services/resumeService';
import AuthModal from '../components/AuthModal';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CoverLetterLandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setCvData } = useCV();

    const [savedResumes, setSavedResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState('');

    useEffect(() => {
        if (user) {
            loadResumes();
        } else {
            setLoading(false);
            setShowAuthModal(true);
        }
    }, [user]);

    const loadResumes = async () => {
        setLoading(true);
        try {
            const resumes = await getUserResumes(user.id);
            setSavedResumes(resumes);
            if (resumes.length === 0) {
                // If they have no resumes, they should build a CV first
                alert("You need at least one saved resume to generate a standalone cover letter.");
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        const resume = savedResumes.find(r => r.id === selectedResumeId);
        if (resume) {
            setCvData(resume.cv_data);
            navigate('/cover-letter');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 600 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '1rem', padding: '0.4rem' }}>
                <ArrowLeft size={16} /> Back to Home
            </button>
            <h1 className="section-title">Select a Base Resume</h1>
            <p className="section-subtitle">
                Choose one of your saved resumes to use as the foundation for your new cover letter.
            </p>

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading saved resumes...</p>
            ) : savedResumes.length > 0 ? (
                <div className="card" style={{ marginTop: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label">Saved Resume</label>
                        <select
                            className="form-input"
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                        >
                            <option value="" disabled>Select a resume...</option>
                            {savedResumes.map(resume => (
                                <option key={resume.id} value={resume.id}>
                                    {resume.name} (Saved on {new Date(resume.created_at).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                        disabled={!selectedResumeId}
                        onClick={handleContinue}
                    >
                        Continue to Generator <ArrowRight size={16} style={{ marginLeft: 8 }} />
                    </button>
                </div>
            ) : null}

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    navigate('/');
                }}
                title="Account Required"
                message="You need a free account and a saved resume to use the standalone Cover Letter generator. Please sign in or create an account to save your CV first."
            />
        </div>
    );
}
