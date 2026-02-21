import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { Upload, FileText, Sparkles, Layout, Download } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();
    const { setCurrentStep } = useCV();

    const handleUpload = () => {
        setCurrentStep(0);
        navigate('/upload');
    };

    const handleManual = () => {
        setCurrentStep(1);
        navigate('/input');
    };

    return (
        <div className="page-container">
            <div className="hero">
                <h1 className="hero-title">
                    Build your <span style={{ color: 'var(--accent)' }}>professional CV</span>
                </h1>
                <p className="hero-subtitle">
                    Upload an existing resume or start from scratch. Tailor it
                    to any job with AI and download a beautifully formatted PDF.
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary btn-lg" onClick={handleUpload}>
                        <Upload size={16} /> Upload CV
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={handleManual}>
                        <FileText size={16} /> Start from scratch
                    </button>
                </div>
            </div>

            <div className="features-grid">
                <div className="card feature-card">
                    <div className="feature-icon">
                        <Sparkles size={18} />
                    </div>
                    <h3 className="feature-title">AI-Powered Tailoring</h3>
                    <p className="feature-desc">
                        Paste a job description and let AI optimize your content
                        to match what recruiters are looking for.
                    </p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">
                        <Layout size={18} />
                    </div>
                    <h3 className="feature-title">Professional Templates</h3>
                    <p className="feature-desc">
                        Choose from 3 pixel-perfect, ATS-compatible templates
                        designed for different industries and styles.
                    </p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">
                        <Download size={18} />
                    </div>
                    <h3 className="feature-title">Instant PDF</h3>
                    <p className="feature-desc">
                        Generate and download a polished PDF in seconds.
                        No sign-up, no watermarks, completely free.
                    </p>
                </div>
            </div>
        </div>
    );
}
